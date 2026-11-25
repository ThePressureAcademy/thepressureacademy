'use strict';

const { createHmac, timingSafeEqual } = require('node:crypto');

const FORM = 'https://formspree.io/f/xwvwkqqg';
const INVITE_LIFETIME = 14 * 24 * 60 * 60;
const PILLARS = ['thinking', 'communication', 'learning', 'action'];
const SUBJECTS = { reading: 'Reading', writing: 'Writing', maths: 'Maths', other: 'Another subject' };
const UUID = /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;

class InputError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function textField(value, label, limit, optional = false) {
  if (optional && value == null) return '';
  if (typeof value !== 'string' || value.length > limit || (!optional && !value.trim())) {
    throw new InputError('Check the ' + label + ' field.');
  }
  return value.trim();
}

function sign(key, message) {
  return createHmac('sha256', key).update(message).digest('base64url');
}

function parentData(input, key) {
  if (typeof input.requestId !== 'string' || !UUID.test(input.requestId)) throw new InputError('Refresh the scorecard and try again.');
  const email = textField(input.email, 'email', 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError('Enter a valid email address.');
  const name = textField(input.name, 'name', 120, true);
  const year = input.child_year || '';
  if (!['', '2', '3', 'other'].includes(year)) throw new InputError('Choose a listed year level.');
  const ref = 'MM-' + sign(key, 'audit:' + input.requestId + ':' + email.toLowerCase()).slice(0, 16);
  const data = {
    intent: 'scorecard-lead', source: 'clarity-scorecard', name, email, child_year: year,
    audit_ref: ref, teacher_input_requested: 'Yes',
    subject: 'Clarity Scorecard · ' + ref,
  };
  let total = 0;
  let lowest = 26;
  for (const pillar of PILLARS) {
    const raw = input[pillar + '_score'];
    if (typeof raw !== 'number' && typeof raw !== 'string') throw new InputError('A pillar score is missing.');
    if (!/^\d{1,2}$/.test(String(raw)) || Number(raw) > 25) throw new InputError('A pillar score is invalid.');
    const score = Number(raw);
    data[pillar + '_score'] = score;
    total += score;
    if (score < lowest) {
      data.weakest_pillar = pillar;
      lowest = score;
    }
  }
  data.total_score = total;
  data.clarity_level = total >= 80 ? 'strong' : total >= 55 ? 'developing' : total >= 35 ? 'significant' : 'critical';
  return data;
}

function makeInvite(key, ref, year, expiry) {
  const body = [ref, year === '2' || year === '3' ? year : 'x', expiry].join('.');
  return body + '.' + sign(key, 'teacher-invite-v1:' + body);
}

function readInvite(key, token, now) {
  if (typeof token !== 'string' || token.length > 110) throw new InputError('Invalid teacher invitation.');
  const match = /^(MM-[A-Za-z0-9_-]{16})\.([23x])\.(\d{10})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) throw new InputError('Invalid teacher invitation.');
  const [, ref, year, expiry, signature] = match;
  const expected = sign(key, 'teacher-invite-v1:' + [ref, year, expiry].join('.'));
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) throw new InputError('Invalid teacher invitation.');
  if (Number(expiry) <= now) throw new InputError('This teacher invitation has expired.', 410);
  return { ref, yearLevel: year === 'x' ? '' : year, expiresAt: new Date(Number(expiry) * 1000).toISOString() };
}

async function teacherData(input, ref) {
  if (typeof input.responseId !== 'string' || !UUID.test(input.responseId)) throw new InputError('Reload the invitation and try again.');
  if (!['prep', '1', '2', '3', '4', '5', '6'].includes(input.yearLevel)) throw new InputError('Choose the year level.');
  const subjects = input.subjects;
  if (!Array.isArray(subjects) || !subjects.length || subjects.length > 4 ||
      new Set(subjects).size !== subjects.length || subjects.some(s => typeof s !== 'string' || !Object.hasOwn(SUBJECTS, s))) {
    throw new InputError('Choose a subject needing support.');
  }
  const otherSubject = subjects.includes('other') ? textField(input.otherSubject, 'subject name', 80) : '';
  const data = {
    intent: 'teacher-homework-input', source: 'mastery-teacher-input',
    audit_ref: ref, response_ref: input.responseId,
    subject: 'Teacher homework input · ' + ref,
    year_level: input.yearLevel === 'prep' ? 'Prep' : 'Year ' + input.yearLevel,
    subjects: subjects.map(s => s === 'other' ? otherSubject : SUBJECTS[s]).join(', '),
    ...(otherSubject ? { other_subject: otherSubject } : {}),
    assigned_homework: textField(input.homework, 'homework', 1500),
    independent_work: textField(input.independent, 'independent work', 1500),
    support_tried: textField(input.supports, 'support tried', 1500, true),
    next_learning_goal: textField(input.nextGoal, 'next learning goal', 1500),
  };
  const { getSubjectPrompt } = await import('../js/config/mm-teacher-prompts.mjs');
  for (const id of subjects) {
    data[id + '_question'] = getSubjectPrompt(input.yearLevel, id);
    data[id + '_response'] = textField(input.subjectNotes?.[id], SUBJECTS[id], 500);
  }
  return data;
}

async function deliver(data, page) {
  const response = await fetch(FORM, {
    method: 'POST',
    headers: {
      Accept: 'application/json', 'Content-Type': 'application/json',
      Origin: 'https://thepressureacademy.com', Referer: 'https://thepressureacademy.com/mastery-method/' + page + '/',
    },
    body: JSON.stringify(data), signal: AbortSignal.timeout(10000), redirect: 'error',
  });
  if (!response.ok) throw new Error('Intake unavailable');
  const result = await response.json();
  if (result.ok !== true && !(result.ok === undefined && typeof result.next === 'string' && result.next)) {
    throw new Error('Intake not acknowledged');
  }
}

module.exports = async function masteryAudit(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use the scorecard or teacher invitation.' });
  }
  try {
    if (req.headers['sec-fetch-site'] === 'cross-site') throw new InputError('Open the form on the Academy website.', 403);
    if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) throw new InputError('Send a JSON form.', 415);
    const input = req.body;
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new InputError('Missing form data.');
    if (Buffer.byteLength(JSON.stringify(input)) > 40000) throw new InputError('The form is too long.', 413);
    const secret = process.env.MM_TEACHER_INVITE_SECRET || process.env.SESSION_SECRET;
    if (!secret) throw new Error('Invitation service unavailable');
    // A purpose-specific key keeps teacher invitations independent of portal session signatures.
    const key = createHmac('sha256', secret).update('mastery-method/teacher-input/v1').digest();
    const now = Math.floor(Date.now() / 1000);
    if (input.action === 'parent') {
      const data = parentData(input, key);
      const expiry = now + INVITE_LIFETIME;
      const token = makeInvite(key, data.audit_ref, data.child_year, expiry);
      await deliver(data, 'scorecard');
      return res.status(200).json({
        auditRef: data.audit_ref, invitePath: '/mastery-method/teacher-input/#invite=' + token,
        expiresAt: new Date(expiry * 1000).toISOString(),
      });
    }
    if (input.action !== 'check' && input.action !== 'teacher') throw new InputError('Unknown form action.');
    const { ref, yearLevel, expiresAt } = readInvite(key, input.token, now);
    if (input.action === 'check') return res.status(200).json({ yearLevel, expiresAt });
    await deliver(await teacherData(input, ref), 'teacher-input');
    return res.status(200).json({ received: true });
  } catch (error) {
    if (error instanceof InputError) return res.status(error.status).json({ error: error.message });
    return res.status(503).json({ error: 'The form could not be confirmed. Please try again shortly.' });
  }
};
