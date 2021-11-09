// helper functions to edit .env file
import {appendFile, createFile, existsSync, readFile, writeFile} from 'fs-extra'
import {getSecret} from './secrets'

export async function addToEnv(key: string, value: string) {
  if (!existsSync('.env')) {
    await createFile('.env')
  }
  const appendString = `${key}=${value}\n`

  // Update current env, future env will be updated in subsequent config() calls of init()
  // could call config(), but only one variable changes, so why try update all
  readFile('.env', 'utf-8', function (err, data) {
    if (err) throw err
    if (data.includes(`${key}=`)) {
      const newData = data.replace(new RegExp(`${key}=.*\n`), appendString)
      writeFile('.env', newData, 'utf-8', function (err) {
        if (err) throw err
      })
    } else appendFile('.env', appendString)
  })
  process.env[key] = value
}

export async function deleteFromEnv(key: string) {
  if (existsSync('.env')) {
    // Delete current env, future env will be updated in subsequent config() calls of init()
    // could call config(), but only one variable changes, so why try update all
    readFile('.env', 'utf-8', function (err, data) {
      if (err) throw err
      if (data.includes(`${key}=`)) {
        const newData = data.replace(new RegExp(`${key}=.*\n`), '')
        writeFile('.env', newData, 'utf-8', function (err) {
          if (err) throw err
        })
      }
    })
    delete process.env[key]
  }
}

export function getFromEnv(key: string) {
  return getSecret(key)
}

/* Data to provide suggestions */
export enum ProviderTypes{
  MAIL='Mail', SMS='SMS', SOCIAL='Social'
}
const providerTypeMailDependency = [
  'NOTIFICATION_EMAIL',
  'NOTIFICATION_EMAIL_FROM',
  'NOTIFICATION_EMAIL_TO',
]
const providerTypeSMSDependency = [
  'NOTIFICATION_SMS_FROM',
  'NOTIFICATION_SMS_TO',
]

interface Provider {
  name: string;
  type: string;
  dependsOn?: string[];
  variables: string[];
}
// Sorted lexicographically
export const notificationsProviderGroup: {[key: string]: Provider} = {
  elks: {
    name: '46ELKS',
    type: ProviderTypes.SMS,
    dependsOn: providerTypeSMSDependency,
    variables: [
      'NOTIFICATION_SMS_46ELKS',
      'NOTIFICATION_SMS_46ELKS_API_PASSWORD',
      'NOTIFICATION_SMS_46ELKS_API_USERNAME',
    ],
  },
  callr: {
    name: 'Callr',
    type: ProviderTypes.SMS,
    dependsOn: providerTypeSMSDependency,
    variables: [
      'NOTIFICATION_SMS_CALLR',
      'NOTIFICATION_SMS_CALLR_LOGIN',
      'NOTIFICATION_SMS_CALLR_PASSWORD',
    ],
  },
  clickatell: {
    name: 'Clickatell',
    type: ProviderTypes.SMS,
    dependsOn: providerTypeSMSDependency,
    variables: [
      'NOTIFICATION_SMS_CLICKATELL',
      'NOTIFICATION_SMS_CLICKATELL_API_KEY',
    ],
  },
  discord: {
    name: 'Discord',
    type: ProviderTypes.SOCIAL,
    variables: [
      'NOTIFICATION_DISCORD',
      'NOTIFICATION_DISCORD_WEBHOOK',
      'NOTIFICATION_DISCORD_WEBHOOK_URL',
    ],
  },
  infobip: {
    name: 'Infobip',
    type: ProviderTypes.SMS,
    dependsOn: providerTypeSMSDependency,
    variables: [
      'NOTIFICATION_SMS_INFOBIP',
      'NOTIFICATION_SMS_INFOBIP_PASSWORD',
      'NOTIFICATION_SMS_INFOBIP_USERNAME',
    ],
  },
  mailgun: {
    name: 'Mailgun',
    type: ProviderTypes.MAIL,
    dependsOn: providerTypeMailDependency,
    variables: [
      'NOTIFICATION_EMAIL_MAILGUN',
      'NOTIFICATION_EMAIL_MAILGUN_API_KEY',
      'NOTIFICATION_EMAIL_MAILGUN_DOMAIN_NAME',
    ],
  },
  nexmo: {
    name: 'Nexmo',
    type: ProviderTypes.SMS,
    dependsOn: providerTypeSMSDependency,
    variables: [
      'NOTIFICATION_SMS_NEXMO',
      'NOTIFICATION_SMS_NEXMO_API_KEY',
      'NOTIFICATION_SMS_NEXMO_API_SECRET',
    ],
  },
  ovh: {
    name: 'OVH',
    type: ProviderTypes.SMS,
    dependsOn: providerTypeSMSDependency,
    variables: [
      'NOTIFICATION_SMS_OVH',
      'NOTIFICATION_SMS_OVH_ACCOUNT',
      'NOTIFICATION_SMS_OVH_APP_KEY',
      'NOTIFICATION_SMS_OVH_APP_SECRET',
      'NOTIFICATION_SMS_OVH_CONSUMER_KEY',
      'NOTIFICATION_SMS_OVH_HOST',
    ],
  },
  plivo: {
    name: 'Plivo',
    type: ProviderTypes.SMS,
    dependsOn: providerTypeSMSDependency,
    variables: [
      'NOTIFICATION_SMS_PLIVO',
      'NOTIFICATION_SMS_PLIVO_AUTH_ID',
      'NOTIFICATION_SMS_PLIVO_AUTH_TOKEN',
    ],
  },
  sendgrid: {
    name: 'SendGrid',
    type: ProviderTypes.MAIL,
    dependsOn: providerTypeMailDependency,
    variables: [
      'NOTIFICATION_EMAIL_SENDGRID',
      'NOTIFICATION_EMAIL_SENDGRID_API_KEY',
    ],
  },
  ses: {
    name: 'SES',
    type: ProviderTypes.MAIL,
    dependsOn: providerTypeMailDependency,
    variables: [
      'NOTIFICATION_EMAIL_SES',
      'NOTIFICATION_EMAIL_SES_ACCESS_KEY_ID',
      'NOTIFICATION_EMAIL_SES_REGION',
      'NOTIFICATION_EMAIL_SES_SECRET_ACCESS_KEY',
      'NOTIFICATION_EMAIL_SES_SESSION_TOKEN',
    ],
  },
  slack: {
    name: 'Slack',
    type: ProviderTypes.SOCIAL,
    variables: [
      'NOTIFICATION_SLACK',
      'NOTIFICATION_SLACK_WEBHOOK',
      'NOTIFICATION_SLACK_WEBHOOK_URL',
    ],
  },
  smtp: {
    name: 'SMTP',
    type: ProviderTypes.MAIL,
    dependsOn: providerTypeMailDependency,
    variables: [
      'NOTIFICATION_EMAIL_SMTP',
      'NOTIFICATION_EMAIL_SMTP_HOST',
      'NOTIFICATION_EMAIL_SMTP_PASSWORD',
      'NOTIFICATION_EMAIL_SMTP_PORT',
      'NOTIFICATION_EMAIL_SMTP_USERNAME',
    ],
  },
  sparkhost: {
    name: 'SparkHost',
    type: ProviderTypes.MAIL,
    dependsOn: providerTypeMailDependency,
    variables: [
      'NOTIFICATION_EMAIL_SPARKPOST',
      'NOTIFICATION_EMAIL_SPARKPOST_API_KEY',
    ],
  },
  telegram: {
    name: 'Telegram',
    type: ProviderTypes.SOCIAL,
    variables: [
      'NOTIFICATION_TELEGRAM',
      'NOTIFICATION_TELEGRAM_BOT_KEY',
      'NOTIFICATION_TELEGRAM_CHAT_ID',
    ],
  },
  twilio: {
    name: 'Twilio',
    type: ProviderTypes.SMS,
    dependsOn: providerTypeSMSDependency,
    variables: [
      'NOTIFICATION_SMS_TWILIO',
      'NOTIFICATION_SMS_TWILIO_ACCOUNT_SID',
      'NOTIFICATION_SMS_TWILIO_AUTH_TOKEN',
    ],
  },
}

// Sorted lexicographically
export const possibleEnvVariables = [
  'NOTIFICATION_DISCORD',
  'NOTIFICATION_DISCORD_WEBHOOK',
  'NOTIFICATION_DISCORD_WEBHOOK_URL',
  'NOTIFICATION_EMAIL',
  'NOTIFICATION_EMAIL_FROM',
  'NOTIFICATION_EMAIL_MAILGUN',
  'NOTIFICATION_EMAIL_MAILGUN_API_KEY',
  'NOTIFICATION_EMAIL_MAILGUN_DOMAIN_NAME',
  'NOTIFICATION_EMAIL_SENDGRID',
  'NOTIFICATION_EMAIL_SENDGRID_API_KEY',
  'NOTIFICATION_EMAIL_SES',
  'NOTIFICATION_EMAIL_SES_ACCESS_KEY_ID',
  'NOTIFICATION_EMAIL_SES_REGION',
  'NOTIFICATION_EMAIL_SES_SECRET_ACCESS_KEY',
  'NOTIFICATION_EMAIL_SES_SESSION_TOKEN',
  'NOTIFICATION_EMAIL_SMTP',
  'NOTIFICATION_EMAIL_SMTP_HOST',
  'NOTIFICATION_EMAIL_SMTP_PASSWORD',
  'NOTIFICATION_EMAIL_SMTP_PORT',
  'NOTIFICATION_EMAIL_SMTP_USERNAME',
  'NOTIFICATION_EMAIL_SPARKPOST',
  'NOTIFICATION_EMAIL_SPARKPOST_API_KEY',
  'NOTIFICATION_EMAIL_TO',
  'NOTIFICATION_SLACK',
  'NOTIFICATION_SLACK_WEBHOOK',
  'NOTIFICATION_SLACK_WEBHOOK_URL',
  'NOTIFICATION_SMS_46ELKS',
  'NOTIFICATION_SMS_46ELKS_API_PASSWORD',
  'NOTIFICATION_SMS_46ELKS_API_USERNAME',
  'NOTIFICATION_SMS_CALLR',
  'NOTIFICATION_SMS_CALLR_LOGIN',
  'NOTIFICATION_SMS_CALLR_PASSWORD',
  'NOTIFICATION_SMS_CLICKATELL',
  'NOTIFICATION_SMS_CLICKATELL_API_KEY',
  'NOTIFICATION_SMS_FROM',
  'NOTIFICATION_SMS_INFOBIP',
  'NOTIFICATION_SMS_INFOBIP_PASSWORD',
  'NOTIFICATION_SMS_INFOBIP_USERNAME',
  'NOTIFICATION_SMS_NEXMO',
  'NOTIFICATION_SMS_NEXMO_API_KEY',
  'NOTIFICATION_SMS_NEXMO_API_SECRET',
  'NOTIFICATION_SMS_OVH',
  'NOTIFICATION_SMS_OVH_ACCOUNT',
  'NOTIFICATION_SMS_OVH_APP_KEY',
  'NOTIFICATION_SMS_OVH_APP_SECRET',
  'NOTIFICATION_SMS_OVH_CONSUMER_KEY',
  'NOTIFICATION_SMS_OVH_HOST',
  'NOTIFICATION_SMS_PLIVO',
  'NOTIFICATION_SMS_PLIVO_AUTH_ID',
  'NOTIFICATION_SMS_PLIVO_AUTH_TOKEN',
  'NOTIFICATION_SMS_TO',
  'NOTIFICATION_SMS_TWILIO',
  'NOTIFICATION_SMS_TWILIO_ACCOUNT_SID',
  'NOTIFICATION_SMS_TWILIO_AUTH_TOKEN',
  'NOTIFICATION_TELEGRAM',
  'NOTIFICATION_TELEGRAM_BOT_KEY',
  'NOTIFICATION_TELEGRAM_CHAT_ID',
]
