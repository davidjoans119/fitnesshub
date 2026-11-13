const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const header = document.querySelector('.site-header');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));
document.getElementById('year').textContent = new Date().getFullYear();

// Demo enquiry flow: validates fields and prepares a clear confirmation, but does not transmit data.
document.getElementById('enquiryForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = document.getElementById('name').value.trim();
  const success = document.getElementById('formSuccess');
  success.style.display = 'block';
  success.textContent = `Thanks, ${name}. Your demo enquiry is ready. Connect the gym's real phone number or booking system to receive submissions.`;
  showToast('Enquiry form tested — connect a real inbox before launch.');
  form.querySelector('.form-submit').textContent = 'ENQUIRY PREPARED ✓';
});

// Compact FAQ-style assistant. Answers intentionally avoid inventing prices, hours or facilities.
const chatPanel = document.getElementById('chatPanel');
const chatLaunch = document.getElementById('chatLaunch');
const chatMessages = document.getElementById('chatMessages');
const chatAnswers = {
  membership: 'Membership prices and current offers have not been confirmed. Please use the enquiry form or contact the gym directly for the latest plans.',
  timings: 'The current opening hours could not be reliably verified. Please confirm timings with the gym before visiting.',
  beginner: 'New to training? Start with a goal conversation and ask the team about a beginner-friendly routine and safe technique.',
  location: 'Fitness Hub Gym is listed in Howrah, West Bengal. Tap “Find the gym” on this page to open the supplied Google Maps pin.',
  personal: 'Ask the team whether one-to-one coaching is available and what it includes.',
  facilities: 'For an accurate list of equipment and facilities, visit the gym and ask the team. The photos on this demo are illustrative.'
};
function addMessage(text, who) {
  const item = document.createElement('div');
  item.className = who === 'user' ? 'user-message' : 'bot-message';
  item.textContent = text;
  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function answerQuestion(question) {
  const normalized = question.toLowerCase();
  let answer = 'Thanks for asking! For the most accurate information, please send an enquiry or contact the gym directly. I can help with membership, timings, beginner guidance or location.';
  if (normalized.includes('member') || normalized.includes('price') || normalized.includes('fee') || normalized.includes('plan')) answer = chatAnswers.membership;
  else if (normalized.includes('time') || normalized.includes('open') || normalized.includes('close') || normalized.includes('hour')) answer = chatAnswers.timings;
  else if (normalized.includes('begin') || normalized.includes('start') || normalized.includes('new')) answer = chatAnswers.beginner;
  else if (normalized.includes('where') || normalized.includes('location') || normalized.includes('address') || normalized.includes('map')) answer = chatAnswers.location;
  else if (normalized.includes('personal') || normalized.includes('trainer') || normalized.includes('coach')) answer = chatAnswers.personal;
  else if (normalized.includes('equipment') || normalized.includes('facility') || normalized.includes('machine')) answer = chatAnswers.facilities;
  window.setTimeout(() => addMessage(answer, 'bot'), 220);
}
function openChat() {
  chatPanel.classList.add('open');
  chatPanel.setAttribute('aria-hidden', 'false');
  document.getElementById('chatText').focus();
}
function closeChat() {
  chatPanel.classList.remove('open');
  chatPanel.setAttribute('aria-hidden', 'true');
}
chatLaunch.addEventListener('click', openChat);
document.getElementById('chatClose').addEventListener('click', closeChat);
document.querySelectorAll('.chat-quick button').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.question;
  const label = button.textContent;
  addMessage(label, 'user');
  window.setTimeout(() => addMessage(chatAnswers[key] || chatAnswers.membership, 'bot'), 180);
}));
document.getElementById('chatForm').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('chatText');
  const question = input.value.trim();
  if (!question) return;
  addMessage(question, 'user');
  input.value = '';
  answerQuestion(question);
});
