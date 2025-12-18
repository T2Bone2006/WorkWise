export function getWorkerConfirmationEmail(
    workerName: string,
    tradeType: string,
    postcode: string
): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to WorkWise</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 48px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                You're on the waitlist! 🎉
              </h1>
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 32px;">
              
              <!-- Greeting -->
              <p style="font-size: 16px; color: #111827; margin: 0 0 24px 0; line-height: 1.6;">
                Hi ${workerName},
              </p>
              
              <p style="font-size: 16px; color: #374151; margin: 0 0 32px 0; line-height: 1.6;">
                Thanks for joining WorkWise! You're officially on the waitlist and we'll notify you as soon as we launch.
              </p>
              
              <!-- Your Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="font-size: 18px; color: #111827; margin: 0 0 16px 0; font-weight: 600;">Your Details</h2>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #6b7280; width: 80px;">Trade:</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111827; font-weight: 500;">${tradeType}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 15px; color: #6b7280;">Location:</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111827; font-weight: 500;">${postcode}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- What Happens Next -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%); border: 1px solid #93c5fd; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="font-size: 18px; color: #1e40af; margin: 0 0 16px 0; font-weight: 600;">What Happens Next?</h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                      <tr>
                        <td width="32" style="vertical-align: top; padding-top: 2px;">
                          <div style="width: 24px; height: 24px; background-color: #3b82f6; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; text-align: center; line-height: 24px;">1</div>
                        </td>
                        <td style="padding-left: 12px; font-size: 15px; color: #1e40af; line-height: 1.6;">
                          You'll receive an email when we launch
                        </td>
                      </tr>
                    </table>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                      <tr>
                        <td width="32" style="vertical-align: top; padding-top: 2px;">
                          <div style="width: 24px; height: 24px; background-color: #3b82f6; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; text-align: center; line-height: 24px;">2</div>
                        </td>
                        <td style="padding-left: 12px; font-size: 15px; color: #1e40af; line-height: 1.6;">
                          Complete a quick 5-minute AI chat interview about your rates and preferences
                        </td>
                      </tr>
                    </table>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="32" style="vertical-align: top; padding-top: 2px;">
                          <div style="width: 24px; height: 24px; background-color: #3b82f6; color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; text-align: center; line-height: 24px;">3</div>
                        </td>
                        <td style="padding-left: 12px; font-size: 15px; color: #1e40af; line-height: 1.6;">
                          Start receiving job matches from property managers
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Key Benefits -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 8px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="24" style="vertical-align: top; padding-top: 2px;">
                          <span style="color: #10b981; font-size: 18px; font-weight: bold;">✓</span>
                        </td>
                        <td style="padding-left: 8px; font-size: 15px; color: #374151; line-height: 1.5;">
                          <strong style="color: #111827;">Zero commission</strong> - keep 100% of what you earn
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="24" style="vertical-align: top; padding-top: 2px;">
                          <span style="color: #10b981; font-size: 18px; font-weight: bold;">✓</span>
                        </td>
                        <td style="padding-left: 8px; font-size: 15px; color: #374151; line-height: 1.5;">
                          <strong style="color: #111827;">No lead fees</strong> - no pay-per-lead charges
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="24" style="vertical-align: top; padding-top: 2px;">
                          <span style="color: #10b981; font-size: 18px; font-weight: bold;">✓</span>
                        </td>
                        <td style="padding-left: 8px; font-size: 15px; color: #374151; line-height: 1.5;">
                          <strong style="color: #111827;">Recurring work</strong> - property managers with 10-50+ properties
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
<!--              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">-->
<!--                <tr>-->
<!--                  <td align="center" style="padding: 0;">-->
<!--                    <a href="https://edentechnologies.co.uk" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">-->
<!--                      Learn More About WorkWise-->
<!--                    </a>-->
<!--                  </td>-->
<!--                </tr>-->
<!--              </table>-->

<!-- ADD THIS NEW SECTION -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #10b981; border-radius: 12px; margin: 32px 0;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="font-size: 18px; color: #065f46; margin: 0 0 12px 0; font-weight: 600;">💼 Know any property developers or managers?</h3>
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #047857; line-height: 1.6;">
                      We're also looking to connect with property developers and property managers who need reliable tradespeople.
                    </p>
                    <p style="margin: 0; font-size: 15px; color: #047857; line-height: 1.6;">
                      If you know anyone managing rental properties or developments, please have them get in touch:
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 0 0;">
                      <tr>
                        <td align="center">
                          <a href="mailto:hello@edentechnologies.co.uk" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                            📧 hello@edentechnologies.co.uk
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
              
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

export function getWorkerReferralEmail(
    workerName: string,
    tradeType: string
): string {
    const firstName = workerName.split(' ')[0];

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Help WorkWise Grow</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 48px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Help Us Grow 🚀
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 32px;">
              
              <p style="font-size: 16px; color: #111827; margin: 0 0 16px 0; line-height: 1.6;">
                Hi ${firstName},
              </p>
              
              <p style="font-size: 16px; color: #374151; margin: 0 0 24px 0; line-height: 1.6;">
                Thanks again for joining WorkWise! The more quality ${tradeType}s we have, the better we can serve property managers - which means more work for everyone.
              </p>
              
              <!-- Share Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%); border: 2px solid #93c5fd; border-radius: 12px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 32px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1e40af;">Know other tradespeople?</h2>
                    <p style="margin: 0 0 24px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                      Share WorkWise and help build a platform that works for everyone.
                    </p>
                    
                    <!-- Share Link -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 16px; text-align: center;">
                          <a href="https://edentechnologies.co.uk/workwise/workers" style="color: #3b82f6; text-decoration: none; font-size: 14px; word-break: break-all; font-weight: 500;">
                            edentechnologies.co.uk/workwise/workers
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Share Buttons -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 0 6px;">
                                <a href="https://wa.me/?text=Just%20joined%20WorkWise%20-%20no%20commission%20platform%20for%20tradespeople.%20Check%20it%3A%20https%3A%2F%2Fedentechnologies.co.uk%2Fworkwise%2Fworkers" 
                                   style="display: inline-block; padding: 12px 20px; background-color: #25D366; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                                    📱 WhatsApp
                                </a>
                              </td>
                              <td style="padding: 0 6px;">
                                <a href="sms:?&body=Just%20joined%20WorkWise%20-%20no%20commission%20platform%20for%20tradespeople.%20Join%3A%20https%3A%2F%2Fedentechnologies.co.uk%2Fworkwise%2Fworkers" 
                                   style="display: inline-block; padding: 12px 20px; background-color: #0088cc; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                                    💬 SMS
                                </a>
                              </td>
                              <td style="padding: 0 6px;">
                                <a href="mailto:?subject=Join%20WorkWise%20-%20No%20Commission%20Platform&body=I%20just%20joined%20WorkWise%20and%20thought%20you%20might%20be%20interested.%0A%0AIt's%20a%20new%20platform%20that%20connects%20tradespeople%20with%20property%20managers%20-%20no%20commission%20fees%2C%20no%20lead%20charges.%0A%0AJoin%20here%3A%20https%3A%2F%2Fedentechnologies.co.uk%2Fworkwise%2Fworkers" 
                                   style="display: inline-block; padding: 12px 20px; background-color: #0084ff; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                                    ✉️ Email
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Copy/Paste Template -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-left: 4px solid #8b5cf6; border-radius: 8px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #111827;">Copy & paste this message:</h3>
                    <div style="font-size: 14px; line-height: 1.6; color: #374151; background-color: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 12px 0;">Just joined WorkWise - a new platform connecting tradespeople with property managers.</p>
                      <p style="margin: 0 0 8px 0;"><strong>What makes it different:</strong></p>
                      <p style="margin: 0 0 4px 0;">• No commission fees - keep 100% of earnings</p>
                      <p style="margin: 0 0 4px 0;">• No pay-per-lead charges</p>
                      <p style="margin: 0 0 4px 0;">• Property managers pay them, not us</p>
                      <p style="margin: 0 0 12px 0;">• Instant AI matching</p>
                      <p style="margin: 0;">Join: https://edentechnologies.co.uk/workwise/workers</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- ADD THIS NEW SECTION -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #10b981; border-radius: 12px; margin: 32px 0;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="font-size: 18px; color: #065f46; margin: 0 0 12px 0; font-weight: 600;">💼 Know any property developers or managers?</h3>
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #047857; line-height: 1.6;">
                      We're also looking to connect with property developers and property managers who need reliable tradespeople.
                    </p>
                    <p style="margin: 0; font-size: 15px; color: #047857; line-height: 1.6;">
                      If you know anyone managing rental properties or developments, please have them get in touch:
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 0 0;">
                      <tr>
                        <td align="center">
                          <a href="mailto:hello@edentechnologies.co.uk" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                            📧 hello@edentechnologies.co.uk
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
              
            </td>
          </tr>
          
          <!-- CTA Button -->
<!--              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0;">-->
<!--                <tr>-->
<!--                  <td align="center" style="padding: 0;">-->
<!--                    <a href="https://edentechnologies.co.uk" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">-->
<!--                      Learn More About WorkWise-->
<!--                    </a>-->
<!--                  </td>-->
<!--                </tr>-->
<!--              </table>-->

            
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">WorkWise</p>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">Get More Work. Keep More Money.</p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Questions? Reply to this email or contact 
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
