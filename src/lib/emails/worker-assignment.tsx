interface JobAssignmentEmailProps {
    workerName: string;
    jobTitle: string;
    jobDescription: string;
    propertyAddress: string;
    urgency: string;
    preferredDate: string | null;
    clientName: string;
    clientCompany: string;
    clientEmail: string;
    clientPhone: string | null;
    estimatedCost: number;
    acceptUrl: string;
    declineUrl: string;
}

export function getWorkerAssignmentEmail({
    workerName,
    jobTitle,
    jobDescription,
    propertyAddress,
    urgency,
    preferredDate,
    clientName,
    clientCompany,
    clientEmail,
    clientPhone,
    estimatedCost,
    acceptUrl,
    declineUrl,
}: JobAssignmentEmailProps): string {
    const firstName = workerName.split(' ')[0];

    const urgencyColors: Record<string, { bg: string; text: string; label: string }> = {
        low: { bg: '#dcfce7', text: '#166534', label: 'Low Priority' },
        medium: { bg: '#fef3c7', text: '#92400e', label: 'Medium Priority' },
        high: { bg: '#fee2e2', text: '#991b1b', label: 'High Priority' },
        emergency: { bg: '#fee2e2', text: '#991b1b', label: 'Emergency' },
    };

    const urgencyStyle = urgencyColors[urgency] || urgencyColors.medium;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Job Assignment</title>
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
                You've Been Selected for a Job!
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
                Great news! A property manager has selected you for a job. Please review the details below and respond as soon as possible.
              </p>

              <!-- Job Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="display: flex; align-items: center; margin-bottom: 16px;">
                      <h2 style="font-size: 20px; color: #111827; margin: 0; font-weight: 600;">${jobTitle}</h2>
                    </div>

                    <!-- Urgency Badge -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                      <tr>
                        <td style="background-color: ${urgencyStyle.bg}; color: ${urgencyStyle.text}; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;">
                          ${urgencyStyle.label}
                        </td>
                      </tr>
                    </table>

                    <p style="font-size: 15px; color: #374151; margin: 0 0 16px 0; line-height: 1.6;">
                      ${jobDescription}
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280; width: 100px;">Location:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 500;">${propertyAddress}</td>
                      </tr>
                      ${preferredDate ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Preferred Date:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 500;">${preferredDate}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Your Quote:</td>
                        <td style="padding: 8px 0; font-size: 18px; color: #059669; font-weight: 700;">£${estimatedCost.toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Client Contact Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%); border: 1px solid #93c5fd; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="font-size: 18px; color: #1e40af; margin: 0 0 16px 0; font-weight: 600;">Client Contact</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280; width: 80px;">Name:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #111827; font-weight: 500;">${clientName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Company:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #111827; font-weight: 500;">${clientCompany}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Email:</td>
                        <td style="padding: 6px 0; font-size: 14px;">
                          <a href="mailto:${clientEmail}" style="color: #3b82f6; text-decoration: none;">${clientEmail}</a>
                        </td>
                      </tr>
                      ${clientPhone ? `
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Phone:</td>
                        <td style="padding: 6px 0; font-size: 14px;">
                          <a href="tel:${clientPhone}" style="color: #3b82f6; text-decoration: none;">${clientPhone}</a>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="${acceptUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                            Accept Job
                          </a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="${declineUrl}" style="display: inline-block; background-color: #ffffff; color: #dc2626; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; border: 2px solid #dc2626;">
                            Decline Job
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Important Note -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.5;">
                      <strong>Please respond within 24 hours.</strong> If you don't respond, the client may select another worker.
                    </p>
                  </td>
                </tr>
              </table>

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
