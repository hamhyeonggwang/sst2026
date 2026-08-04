/** SST 2026 접수 마감 — true이면 신청 불가 */
const SST_REGISTRATION_CLOSED = false;

const SST_CLOSED_MESSAGE = {
  title: '접수가 모두 마감되었습니다',
  body: '2026년 SST 캠프 참가 신청 접수가 종료되었습니다.\n문의 사항은 서울특별시 작업치료사회 공식 채널로 연락해 주세요.',
};

function ensureClosedModal() {
  if (document.getElementById('sst-closed-modal')) return;

  const style = document.createElement('style');
  style.textContent = `
    .sst-modal-overlay {
      position: fixed; inset: 0; z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      padding: 24px;
      background: rgba(13, 79, 74, 0.55);
      backdrop-filter: blur(6px);
      opacity: 0; visibility: hidden;
      transition: opacity 0.25s, visibility 0.25s;
    }
    .sst-modal-overlay.is-open {
      opacity: 1; visibility: visible;
    }
    .sst-modal {
      width: 100%; max-width: 420px;
      background: #faf8f4;
      border-radius: 20px;
      padding: 40px 36px 32px;
      text-align: center;
      box-shadow: 0 24px 64px rgba(13, 79, 74, 0.25);
      transform: translateY(12px) scale(0.98);
      transition: transform 0.25s;
    }
    .sst-modal-overlay.is-open .sst-modal {
      transform: translateY(0) scale(1);
    }
    .sst-modal-icon {
      font-size: 2.5rem; margin-bottom: 16px; line-height: 1;
    }
    .sst-modal-title {
      font-family: 'Noto Serif KR', Georgia, serif;
      font-size: 1.35rem; font-weight: 700;
      color: #0d4f4a; margin-bottom: 14px; line-height: 1.4;
    }
    .sst-modal-body {
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 0.95rem; line-height: 1.75;
      color: #444; white-space: pre-line; margin-bottom: 28px;
    }
    .sst-modal-btn {
      font-family: 'Pretendard', sans-serif;
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 140px;
      background: #1a7a72; color: #fff;
      border: none; border-radius: 100px;
      padding: 14px 32px;
      font-size: 0.95rem; font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .sst-modal-btn:hover { background: #0d4f4a; }
    .apply-closed .apply-main {
      pointer-events: none; user-select: none; opacity: 0.45;
    }
    .apply-closed-banner {
      display: none;
      margin-bottom: 24px;
      padding: 16px 20px;
      background: #fff3e0;
      border: 1px solid #e8c99a;
      border-radius: 12px;
      font-family: 'Pretendard', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      color: #7a5c2a;
      text-align: center;
    }
    .apply-closed .apply-closed-banner { display: block; }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'sst-closed-modal';
  overlay.className = 'sst-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = `
    <div class="sst-modal">
      <div class="sst-modal-icon" aria-hidden="true">📋</div>
      <h2 class="sst-modal-title"></h2>
      <p class="sst-modal-body"></p>
      <button type="button" class="sst-modal-btn">확인</button>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('.sst-modal-title').textContent = SST_CLOSED_MESSAGE.title;
  overlay.querySelector('.sst-modal-body').textContent = SST_CLOSED_MESSAGE.body;

  const close = () => overlay.classList.remove('is-open');
  overlay.querySelector('.sst-modal-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });
}

function showRegistrationClosedModal() {
  ensureClosedModal();
  document.getElementById('sst-closed-modal').classList.add('is-open');
}

function lockApplyPage() {
  document.body.classList.add('apply-closed');
  const main = document.querySelector('.apply-main');
  if (main) {
    const banner = document.createElement('div');
    banner.className = 'apply-closed-banner';
    banner.textContent = '접수가 모두 마감되었습니다.';
    main.insertBefore(banner, main.firstChild);
  }
  const wrap = document.querySelector('.apply-wrap');
  if (wrap) {
    wrap.querySelectorAll('input, textarea, select, button').forEach((el) => {
      el.disabled = true;
    });
  }
}

function initRegistrationClosed() {
  if (!SST_REGISTRATION_CLOSED) return;

  ensureClosedModal();

  document.querySelectorAll('[data-apply-link]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showRegistrationClosedModal();
    });
  });

  if (document.body.dataset.page === 'apply') {
    lockApplyPage();
    showRegistrationClosedModal();
  }
}

document.addEventListener('DOMContentLoaded', initRegistrationClosed);
