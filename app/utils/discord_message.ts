import env from '#start/env'
import { ExceptIntels } from '#utils/except/types'

class DiscordMessage {
  private _webhook = env.get('DISCORD_WEBHOOK')
  private _headtext = `[Backend_${env.get('NODE_ENV')}] `
  private _nodeEnv = env.get('NODE_ENV')

  async exceptError(logs: {
    intels: ExceptIntels
    aborted: boolean
    debug?: any
    url?: string
    stack?: string
  }): Promise<void> {
    let debugMessage = ''

    if (typeof logs?.debug?.message === 'string') debugMessage = logs?.debug?.message
    else if (typeof logs?.debug === 'string') debugMessage = logs?.debug
    else debugMessage = 'none'

    await this.custom(
      `[Except] ${logs.intels.status} (${logs.intels.code})}
      Critial: ${logs.intels.critical} - Aborted: ${logs.aborted}
      Message: ${debugMessage}
      Debug message: ${typeof logs.debug === 'string' ? logs.debug : 'none'}
      URL: ${logs?.url}`
    )
  }

  async custom(message: string, preprod: boolean = true): Promise<void> {
    if (preprod === false && this._nodeEnv !== 'production') return

    await this._post(this._headtext + message)
  }

  private async _post(message: string): Promise<void> {
    if (this._webhook === undefined) return

    await fetch(this._webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    })
  }
}

const discordMessage = new DiscordMessage()
export { discordMessage as default }
