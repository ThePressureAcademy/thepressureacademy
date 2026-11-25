/** The parent shares the private write-only link themselves. Keep it in this page's memory. */
export async function requestTeacherInvite(formData, requestId) {
  const response = await fetch('/api/mastery-audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ action: 'parent', requestId, ...Object.fromEntries(formData) }),
  });
  if (!response.ok) throw new Error('The parent audit could not be confirmed.');

  const { auditRef, invitePath, expiresAt } = await response.json();
  const url = new URL(invitePath, location.origin);
  const expires = new Date(expiresAt);
  if (!auditRef || !Number.isFinite(expires.getTime()) || url.origin !== location.origin ||
      url.pathname !== '/mastery-method/teacher-input/' || url.search ||
      !new URLSearchParams(url.hash.slice(1)).get('invite')) {
    throw new Error('The teacher invitation could not be verified.');
  }
  return { url: url.href, expires };
}

export function displayTeacherInvite({ url, expires }) {
  const field = document.getElementById('teacher-link');
  const status = document.getElementById('teacher-action-status');
  const share = document.getElementById('share-teacher-link');
  field.value = url;
  document.getElementById('teacher-expires').textContent =
    'Link expires ' + new Intl.DateTimeFormat('en-AU', { dateStyle: 'long', timeStyle: 'short' }).format(expires) + ' (your local time).';
  function selectLink() {
    field.focus();
    field.select();
    status.textContent = 'Link selected. Use your device’s Copy option.';
  }
  document.getElementById('copy-teacher-link').onclick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = 'Link copied. You can paste it into your message to the teacher.';
    } catch {
      selectLink();
    }
  };
  if (typeof navigator.share === 'function') {
    share.hidden = false;
    share.onclick = async () => {
      try {
        await navigator.share({ title: 'Mastery Method classroom observations', text: 'Could you add your classroom observations for our learning audit?', url });
      } catch (error) {
        if (error.name !== 'AbortError') selectLink();
      }
    };
  }
  document.getElementById('teacher-invite').hidden = false;
}
