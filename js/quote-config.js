/* ==========================================================
   NEW BTP SARL — E-mail sending setup (quote popup + contact form)
   ----------------------------------------------------------
   Both forms send their content to the e-mail address below through
   FormSubmit (https://formsubmit.co) — free, no account, no backend.

   ONE-TIME ACTIVATION (required):
     1. Put the site online (or run it with Live Server: http://127.0.0.1:5500).
        Opening index.html directly from the disk (file://) is blocked by browsers.
     2. Send one test message from the contact form or the quote popup.
     3. FormSubmit e-mails an "Activate" link to `recipient`. Click it (check Spam).
        From then on every submission arrives in that inbox.
     4. Recommended: after activation FormSubmit gives you a random alias
        (looks like a1b2c3d4…). Paste it in `recipientId` so your real address
        is no longer visible in the page source.

   Attachments: the popup sends the selected files with the e-mail. If your
   provider ever refuses them, the file NAMES are always listed in the e-mail.

   Alternative: provider "web3forms" (needs `accessKey` from web3forms.com).
   Never put an SMTP password or private secret in this file.
   ========================================================== */
window.NEWBTP_QUOTE = {
  provider: "formsubmit",
  recipient: "newbtp.commercial@gmail.com",   // address that receives every request
  recipientId: "",                            // optional FormSubmit random alias (after activation)
  accessKey: "",                              // only for provider "web3forms"
  attachFiles: true,
  timeoutMs: 25000
};
