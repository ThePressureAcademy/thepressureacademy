const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const masteryAudit = require('../api/mastery-audit.js');

const localFetch = globalThis.fetch;
const parent = {
  action: 'parent', requestId: '95cfa03d-85e8-4cc7-a253-381f86bbeee2',
  name: 'Example Parent', email: 'parent@example.invalid', child_year: '2',
  thinking_score: 20, communication_score: '14', learning_score: 13, action_score: 21,
};
const teacher = {
  action: 'teacher', responseId: '364cce5f-1f58-46ca-8fbd-a17732b0d4f5',
  yearLevel: '3', subjects: ['maths', 'reading'],
  subjectNotes: { maths: 'Draw a diagram.', reading: 'Find a sentence in the text.' },
  homework: 'Read the passage and solve the problem.',
  independent: 'Can retell the story.', nextGoal: 'Explain the reasoning.',
};

async function setup(t) {
  const previousSecret = process.env.MM_TEACHER_INVITE_SECRET;
  process.env.MM_TEACHER_INVITE_SECRET = 'test-only-teacher-invitation-key';
  t.after(() => {
    if (previousSecret === undefined) delete process.env.MM_TEACHER_INVITE_SECRET;
    else process.env.MM_TEACHER_INVITE_SECRET = previousSecret;
  });
  const reports = [];
  const delivery = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://formspree.io/f/xwvwkqqg');
    assert.equal(options.method, 'POST');
    reports.push(JSON.parse(options.body));
    return Response.json({ ok: true });
  });
  // The platform parses JSON and adds status() and json() to the HTTP response.
  const server = http.createServer(async (req, res) => {
    let content = '';
    for await (const chunk of req) content += chunk;
    req.body = content ? JSON.parse(content) : undefined;
    res.status = code => { res.statusCode = code; return res; };
    res.json = data => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };
    await masteryAudit(req, res);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = 'http://127.0.0.1:' + server.address().port + '/api/mastery-audit';
  async function send(data) {
    const response = await localFetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Connection: 'close' },
      body: JSON.stringify(data),
    });
    return { status: response.status, headers: response.headers, body: await response.json() };
  }
  return { reports, delivery, send };
}

async function invite(send) {
  const { status, body } = await send(parent);
  assert.equal(status, 200);
  assert.match(body.auditRef, /^MM-[a-zA-Z0-9_-]{16}$/);
  const path = new URL(body.invitePath, 'https://example.invalid');
  assert.equal(path.pathname, '/mastery-method/teacher-input/');
  assert.equal(path.search, '');
  const token = new URLSearchParams(path.hash.slice(1)).get('invite');
  assert.ok(token);
  return { ...body, token };
}

test('the accepted audit and guided teacher report match without sharing the parent scorecard', async t => {
  const { reports, send } = await setup(t);
  const { auditRef, token, expiresAt, invitePath } = await invite(send);
  const [scorecard] = reports;
  assert.equal(scorecard.audit_ref, auditRef);
  assert.equal(scorecard.email, parent.email);
  assert.equal(scorecard.intent, 'scorecard-lead');
  assert.equal(scorecard.total_score, 68);
  assert.equal(scorecard.learning_score, 13);
  assert.equal(scorecard.communication_score, 14);
  assert.equal(scorecard.weakest_pillar, 'learning');
  assert.equal(scorecard.clarity_level, 'developing');
  assert.equal(scorecard.teacher_input_requested, 'Yes');
  const check = await send({ action: 'check', token });
  assert.equal(check.status, 200);
  assert.equal(check.headers.get('referrer-policy'), 'no-referrer');
  assert.match(check.headers.get('cache-control'), /no-store/);
  assert.deepEqual(check.body, { yearLevel: '2', expiresAt });
  assert.equal(reports.length, 1);
  for (const value of [parent.email, parent.name, parent.requestId])
    assert.ok(!decodeURIComponent(invitePath).includes(value));

  const submission = await send({
    ...teacher, token, subjects: [...teacher.subjects, 'other'], otherSubject: 'Science',
    subjectNotes: { ...teacher.subjectNotes, other: 'Name the observable changes.' },
  });
  assert.equal(submission.status, 200);
  assert.deepEqual(submission.body, { received: true });
  const report = reports[1];
  assert.equal(report.audit_ref, auditRef);
  assert.equal(report.response_ref, teacher.responseId);
  assert.equal(report.subjects, 'Maths, Reading, Science');
  assert.equal(report.other_subject, 'Science');
  assert.equal(report.other_question, 'Which idea should they explain using an example from class?');
  assert.equal(report.other_response, 'Name the observable changes.');
  assert.equal(report.year_level, 'Year 3');
  assert.equal(report.maths_question, 'How should they represent the problem and explain their steps?');
  assert.equal(report.reading_question, 'Which part of the text should they use to support their answer?');
  assert.equal(report.maths_response, teacher.subjectNotes.maths);
  assert.equal(report.reading_response, teacher.subjectNotes.reading);
  assert.equal(report.assigned_homework, teacher.homework);
  for (const field of ['email', 'name', 'total_score', 'weakest_pillar', 'thinking_score', 'token'])
    assert.equal(Object.hasOwn(report, field), false);
});

test('missing, changed and expired invitations cannot be checked or used to submit', async t => {
  const { send, reports } = await setup(t);
  const issued = Date.UTC(2026, 10, 25);
  const clock = t.mock.method(Date, 'now', () => issued);
  const { token, expiresAt } = await invite(send);
  const expiry = Date.parse(expiresAt);
  assert.equal(expiry - issued, 14 * 24 * 60 * 60 * 1000);
  const changed = token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A');
  for (const missingOrChanged of [undefined, changed]) {
    for (const form of [{ action: 'check' }, teacher])
      assert.equal((await send({ ...form, token: missingOrChanged })).status, 400);
  }
  clock.mock.mockImplementation(() => expiry - 1000);
  assert.equal((await send({ action: 'check', token })).status, 200);
  clock.mock.mockImplementation(() => expiry);
  for (const form of [{ action: 'check' }, teacher])
    assert.equal((await send({ ...form, token })).status, 410);
  assert.equal(reports.length, 1);
});

test('invalid audit answers and incomplete teacher observations produce no intake reports', async t => {
  const { reports, send } = await setup(t);
  for (const invalid of [
    { email: 'wrong' }, { requestId: '' }, { learning_score: 26 }, { action_score: null },
  ]) assert.equal((await send({ ...parent, ...invalid })).status, 400);
  assert.equal(reports.length, 0);
  const { token } = await invite(send);
  for (const invalid of [
    { yearLevel: '7' }, { subjects: [] }, { subjects: ['maths', 'maths'] },
    { subjects: ['other'], subjectNotes: { other: 'Describe the diagram.' } },
    { subjects: ['other'], otherSubject: '   ', subjectNotes: { other: 'Describe the diagram.' } },
    { subjectNotes: { maths: 'Only one subject answered.' } }, { nextGoal: '' }, { responseId: '' },
  ]) assert.equal((await send({ ...teacher, token, ...invalid })).status, 400);
  assert.equal(reports.length, 1);
});

test('failed delivery gives no confirmation and retries reuse the original audit and response IDs', async t => {
  const { reports, send, delivery } = await setup(t);
  let sentOnFailure;
  delivery.mock.mockImplementationOnce(async (_url, options) => {
    sentOnFailure = JSON.parse(options.body);
    return new Response(null, { status: 503 });
  });
  const rejected = await send(parent);
  assert.equal(rejected.status, 503);
  assert.deepEqual(Object.keys(rejected.body), ['error']);
  const { auditRef, token } = await invite(send);
  assert.equal(auditRef, sentOnFailure.audit_ref);
  for (const acknowledgement of [{}, { ok: false, next: '/thanks' }]) {
    delivery.mock.mockImplementationOnce(async (_url, options) => {
      sentOnFailure = JSON.parse(options.body);
      return Response.json(acknowledgement);
    });
    const unconfirmed = await send({ ...teacher, token });
    assert.equal(unconfirmed.status, 503);
    assert.deepEqual(Object.keys(unconfirmed.body), ['error']);
  }
  const confirmed = await send({ ...teacher, token });
  assert.equal(confirmed.status, 200);
  assert.deepEqual(confirmed.body, { received: true });
  assert.equal(reports[1].response_ref, sentOnFailure.response_ref);
  assert.equal(reports[1].audit_ref, auditRef);
});
