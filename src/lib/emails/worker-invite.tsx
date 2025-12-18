// Email template for inviting workers from waitlist to register

interface WorkerInviteEmailProps {
    workerName: string;
    tradeType: string;
    registerUrl: string;
}

export function getWorkerInviteEmail({
    workerName,
    tradeType,
    registerUrl,
}: WorkerInviteEmailProps): string {
    const firstName = workerName.split(' ')[0];

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited to Join WorkWise</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                You're Invited to Join WorkWise!
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 32px;">

              <!-- Greeting -->
              <p style="font-size: 16px; color: #111827; margin: 0 0 24px 0; line-height: 1.6;">
                Hi ${firstName},
              </p>

              <p style="font-size: 16px; color: #374151; margin: 0 0 32px 0; line-height: 1.6;">
                Great news! WorkWise is now live and we're ready for you to join. As a ${tradeType} on our waitlist, you have priority access to create your account.
              </p>

              <!-- What You'll Get -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%); border: 1px solid #93c5fd; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="font-size: 18px; color: #1e40af; margin: 0 0 16px 0; font-weight: 600;">What You'll Get</h3>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                      <tr>
                        <td width="32" style="vertical-align: top; padding-top: 2px;">
                          <span style="color: #10b981; font-size: 18px; font-weight: bold;">&#10003;</span>
                        </td>
                        <td style="padding-left: 8px; font-size: 15px; color: #1e40af; line-height: 1.6;">
                          <strong>Zero commission</strong> - keep 100% of what you earn
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                      <tr>
                        <td width="32" style="vertical-align: top; padding-top: 2px;">
                          <span style="color: #10b981; font-size: 18px; font-weight: bold;">&#10003;</span>
                        </td>
                        <td style="padding-left: 8px; font-size: 15px; color: #1e40af; line-height: 1.6;">
                          <strong>Quality jobs</strong> - property managers with 10-50+ properties
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="32" style="vertical-align: top; padding-top: 2px;">
                          <span style="color: #10b981; font-size: 18px; font-weight: bold;">&#10003;</span>
                        </td>
                        <td style="padding-left: 8px; font-size: 15px; color: #1e40af; line-height: 1.6;">
                          <strong>AI matching</strong> - get matched to jobs that fit your skills
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- How It Works -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="font-size: 18px; color: #111827; margin: 0 0 16px 0; font-weight: 600;">Getting Started is Easy</h3>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                      <tr>
                        <td width="32" style="vertical-align: top; padding-top: 2px;">
                          <div style="width: 24px; height: 24px; background-color: #3b82f6; color: #ffffff; border-radius: 50%; font-size: 12px; font-weight: 700; text-align: center; line-height: 24px;">1</div>
                        </td>
                        <td style="padding-left: 12px; font-size: 15px; color: #374151; line-height: 1.6;">
                          Click the button below to create your account
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                      <tr>
                        <td width="32" style="vertical-align: top; padding-top: 2px;">
                          <div style="width: 24px; height: 24px; background-color: #3b82f6; color: #ffffff; border-radius: 50%; font-size: 12px; font-weight: 700; text-align: center; line-height: 24px;">2</div>
                        </td>
                        <td style="padding-left: 12px; font-size: 15px; color: #374151; line-height: 1.6;">
                          Complete a quick 5-minute AI chat about your rates
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="32" style="vertical-align: top; padding-top: 2px;">
                          <div style="width: 24px; height: 24px; background-color: #3b82f6; color: #ffffff; border-radius: 50%; font-size: 12px; font-weight: 700; text-align: center; line-height: 24px;">3</div>
                        </td>
                        <td style="padding-left: 12px; font-size: 15px; color: #374151; line-height: 1.6;">
                          Start receiving job matches from property managers
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${registerUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                      Create Your Account
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.6; text-align: center;">
                Your details from the waitlist will be pre-filled when you register.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">WorkWise</p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">Get More Work. Keep More Money.</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Questions? Reply to this email or contact us at
                <a href="mailto:hello@edentechnologies.co.uk" style="color: #3b82f6; text-decoration: none;">hello@edentechnologies.co.uk</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
}
