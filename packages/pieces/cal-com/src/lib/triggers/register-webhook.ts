import { createTrigger, Trigger, TriggerStrategy, Property} from "@activepieces/pieces-framework"
import { httpClient, HttpRequest, HttpMethod } from '@activepieces/pieces-common';

const markdown = `
To obtain the API Key, please follow these steps:
1. Go to https://app.cal.com/settings/developer/api-keys
2. Generate an API Key and copy it.
3. Paste the copied API Key.
`
export const registerWebhooks = ({
  name,
  description,
  displayName,
  sampleData
}: {
  name: string,
  description: string,
  displayName: string,
  sampleData: Record<string, unknown>
}): Trigger =>
  createTrigger({
    name,
    description,
    displayName,
    props: {
      api_key: Property.SecretText({
        displayName: 'API Key',
        description: markdown,
        required: true
      })
    },
    sampleData: sampleData,
    type: TriggerStrategy.WEBHOOK,
    async onEnable(context) {
      const request: HttpRequest = {
        method: HttpMethod.POST,
        url: `https://api.cal.com/v1/hooks`,
        body: {
          eventTriggers: [name],
          subscriberUrl: context.webhookUrl,
          active: true
        },
        queryParams: {
          apiKey: context.propsValue.api_key
        }
      }

      const response = await httpClient.sendRequest<WebhookResponseBody>(request)

      if (response.status === 200) {
        console.debug("trigger.onEnable", response.body.webhook, context)
        await context.store?.put(`cal_com_trigger_${name}`, response.body.webhook)
      }
    },
    async onDisable(context) {
      const data = await context.store?.get<WebhookInformation>(`cal_com_trigger_${name}`)
      if (data != null) {
        const request: HttpRequest = {
          method: HttpMethod.DELETE,
          url: `https://api.cal.com/v1/hooks/${data.id}`,
          queryParams: {
            apiKey: context.propsValue.api_key
          }
        }

        const response = await httpClient.sendRequest(request)
        console.debug("trigger.onDisable", response)
      } else {
        console.debug(`trigger 'cal_com_trigger_${name}' not found`)
      }
    },
    async run(context) {
      console.debug("trigger running", context)
      return [context.payload.body]
    }
  })

interface WebhookInformation {
  id: string,
  userId: number,
  eventTypeId?: null | string,
  payloadTemplate?: null | string,
  eventTriggers: any[],
  appId?: null | string,
  subscriberUrl: string
}

interface WebhookResponseBody {
  webhook: WebhookInformation,
  message: string
}
