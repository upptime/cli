import {UppConfig} from '../interfaces'
import axios from 'axios'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import {getSecret} from './secrets'
import {infoErrorLogger} from './log'

export const sendNotification = async (config: UppConfig, text: string) => {
  infoErrorLogger.info(`[debug] Sending notification ${text}`)
  infoErrorLogger.info(`[debug] Notification config has ${(config.notifications || []).length} keys`)
  for await (const notification of config.notifications || []) {
    if (notification.type === 'slack') {
      infoErrorLogger.info(`[debug] Sending Slack notification to channel ${notification.channel}`)
      const token = getSecret('SLACK_APP_ACCESS_TOKEN')
      if (token) {
        const {data} = await axios.post(
          'https://slack.com/api/chat.postMessage',
          {channel: notification.channel, text},
          {headers: {Authorization: `Bearer ${getSecret('SLACK_BOT_ACCESS_TOKEN')}`}}
        )
        infoErrorLogger.info(`[debug] Slack response ${data}`)
      }
      infoErrorLogger.info(`[debug] Slack token found? ${Boolean(token)}`)
    } else if (notification.type === 'discord') {
      infoErrorLogger.info('[debug] Sending Discord notification')
      const webhookUrl = getSecret('DISCORD_WEBHOOK_URL')
      if (webhookUrl) await axios.post(webhookUrl, {content: text})
    } else if (notification.type === 'email') {
      infoErrorLogger.info('[debug] Sending email notification')
      const transporter = nodemailer.createTransport({
        host: getSecret('NOTIFICATION_SMTP_HOST'),
        port: getSecret('NOTIFICATION_SMTP_PORT') || 587,
        secure: Boolean(getSecret('NOTIFICATION_SMTP_SECURE')),
        auth: {
          user: getSecret('NOTIFICATION_SMTP_USER'),
          pass: getSecret('NOTIFICATION_SMTP_PASSWORD'),
        },
      } as SMTPTransport.Options)
      await transporter.sendMail({
        from: getSecret('NOTIFICATION_SMTP_USER'),
        to: getSecret('NOTIFICATION_EMAIL') || getSecret('NOTIFICATION_SMTP_USER'),
        subject: text,
        text: text,
        html: `<p>${text}</p>`,
      })
      infoErrorLogger.info('[debug] Sent notification')
    } else {
      infoErrorLogger.info(`This notification type is not supported: ${notification.type}`)
    }
  }
  infoErrorLogger.info('[debug] Notifications are sent')
}
