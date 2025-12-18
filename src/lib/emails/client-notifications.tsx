// Email templates for notifying clients about worker actions

interface WorkerAcceptedEmailProps {
    clientName: string;
    workerName: string;
    workerEmail: string;
    workerPhone: string | null;
    workerTradeType: string;
    jobTitle: string;
    jobDescription: string;
    propertyAddress: string;
}

export function getWorkerAcceptedEmail({
    clientName,
    workerName,
    workerEmail,
    workerPhone,
    workerTradeType,
    jobTitle,
    jobDescription,
    propertyAddress,
}: WorkerAcceptedEmailProps): string {
    const firstName = clientName.split(' ')[0];

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Worker Accepted Your Job</title>
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
                Great News! Worker Accepted
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
                <strong>${workerName}</strong> has accepted your job and is ready to get started. You can now contact them directly to coordinate the work.
              </p>

              <!-- Job Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="font-size: 18px; color: #111827; margin: 0 0 16px 0; font-weight: 600;">Job Details</h2>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280; width: 100px;">Job:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 500;">${jobTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280; vertical-align: top;">Description:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827;">${jobDescription}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Location:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 500;">${propertyAddress}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Worker Contact Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%); border: 1px solid #93c5fd; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="font-size: 18px; color: #1e40af; margin: 0 0 16px 0; font-weight: 600;">Worker Contact Details</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280; width: 80px;">Name:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #111827; font-weight: 500;">${workerName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Trade:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #111827; font-weight: 500;">${workerTradeType}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Email:</td>
                        <td style="padding: 6px 0; font-size: 14px;">
                          <a href="mailto:${workerEmail}" style="color: #3b82f6; text-decoration: none;">${workerEmail}</a>
                        </td>
                      </tr>
                      ${workerPhone ? `
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Phone:</td>
                        <td style="padding: 6px 0; font-size: 14px;">
                          <a href="tel:${workerPhone}" style="color: #3b82f6; text-decoration: none;">${workerPhone}</a>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #166534;">Next Steps</h4>
                    <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.5;">
                      Contact ${workerName.split(' ')[0]} to confirm the schedule and any other details. You can reach them by phone or email above.
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
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">Connecting Property Managers with Quality Tradespeople</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Questions? Contact us at
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

interface WorkerDeclinedEmailProps {
    clientName: string;
    workerName: string;
    jobTitle: string;
    jobDescription: string;
    propertyAddress: string;
    declineReason: string | null;
    dashboardUrl: string;
}

export function getWorkerDeclinedEmail({
    clientName,
    workerName,
    jobTitle,
    jobDescription,
    propertyAddress,
    declineReason,
    dashboardUrl,
}: WorkerDeclinedEmailProps): string {
    const firstName = clientName.split(' ')[0];

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Worker Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 48px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Worker Unavailable
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 32px;">

              <p style="font-size: 16px; color: #111827; margin: 0 0 24px 0; line-height: 1.6;">
                Hi ${firstName},
              </p>

              <p style="font-size: 16px; color: #374151; margin: 0 0 32px 0; line-height: 1.6;">
                Unfortunately, <strong>${workerName}</strong> is unable to take on this job at this time.
              </p>

              ${declineReason ? `
              <!-- Reason Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #92400e;">Reason provided:</h3>
                    <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.5;">${declineReason}</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Job Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="font-size: 18px; color: #111827; margin: 0 0 16px 0; font-weight: 600;">Job Details</h2>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280; width: 100px;">Job:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 500;">${jobTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Location:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 500;">${propertyAddress}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                      View Other Matched Workers
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.6; text-align: center;">
                Don't worry - you can select another worker from your matches.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">WorkWise</p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">Connecting Property Managers with Quality Tradespeople</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Questions? Contact us at
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

interface JobCompletedEmailProps {
    clientName: string;
    workerName: string;
    jobTitle: string;
    jobDescription: string;
    propertyAddress: string;
    completedAt: string;
}

export function getJobCompletedEmail({
    clientName,
    workerName,
    jobTitle,
    jobDescription,
    propertyAddress,
    completedAt,
}: JobCompletedEmailProps): string {
    const firstName = clientName.split(' ')[0];

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Completed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Job Completed!
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 32px;">

              <p style="font-size: 16px; color: #111827; margin: 0 0 24px 0; line-height: 1.6;">
                Hi ${firstName},
              </p>

              <p style="font-size: 16px; color: #374151; margin: 0 0 32px 0; line-height: 1.6;">
                <strong>${workerName}</strong> has marked the following job as completed.
              </p>

              <!-- Job Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <!-- Checkmark -->
                    <div style="text-align: center; margin-bottom: 16px;">
                      <span style="display: inline-block; width: 48px; height: 48px; background-color: #10b981; border-radius: 50%; line-height: 48px; font-size: 24px; color: #ffffff;">&#10003;</span>
                    </div>

                    <h2 style="font-size: 20px; color: #166534; margin: 0 0 16px 0; font-weight: 600; text-align: center;">${jobTitle}</h2>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #166534; width: 100px;">Location:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #166534; font-weight: 500;">${propertyAddress}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #166534;">Completed:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #166534; font-weight: 500;">${completedAt}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #166534;">Worker:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #166534; font-weight: 500;">${workerName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Follow Up -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.5;">
                      If you have any questions about the completed work or need follow-up, you can reach out to ${workerName.split(' ')[0]} directly or contact WorkWise support.
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
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">Connecting Property Managers with Quality Tradespeople</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Questions? Contact us at
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
