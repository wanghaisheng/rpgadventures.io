import axios from 'axios'
import Cookies from 'js-cookie'
import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MessagePanel from 'components/Elements/MessagePanel'
import SpinnerButton from 'components/Elements/SpinnerButton'
import config from 'config.json'
// https://plausible.io/docs/nextjs-integration
import { usePlausible } from 'next-plausible'

export default function Subscribe() {
  const emailInput = useRef(null)
  const [status, setStatus] = useState({ state: '', message: '' })
  const plausible = usePlausible()

  async function submitEmail(e) {
    e.preventDefault()
    setStatus({ state: 'loading', message: '' })

    const { data } = await axios.post('/api/subscribe', {
      email: emailInput.current.value,
      formId: 2745585, // https://app.convertkit.com/forms/designers/2745585/edit
    })
    if (data.error) return setStatus({ state: 'error', message: data.error })

    emailInput.current.value = ''
    setStatus({
      state: 'success',
      message: `Success! Now check your email to confirm your subscription.`, // Thank you for subscribing!
    })
    Cookies.set('subscribed', true)
    plausible(`SubscribeBox: Subscribed to Newsletter`)
  }

  return (
    <div className={`mailing-list`}>
      {config.subscribeCTA}
      <form className="form" onSubmit={submitEmail}>
        <input
          ref={emailInput}
          aria-label="Email for newsletter"
          placeholder="Enter your email..."
          type="email"
          autoComplete="email"
          required
        />
        <SpinnerButton className="btn-subscribe" isloading={status.state === 'loading'} type="submit">
          Subscribe
        </SpinnerButton>
        <a
          className="btn-square"
          target="_blank"
          rel="noopener noreferrer"
          href={config.subscribeYoutubeLink}
          onClick={() => plausible(`SubscribeBox: Clicked on YouTube Channel`)}
        >
          <FontAwesomeIcon icon={['fab', 'youtube']} />
        </a>
        <a
          className="btn-square"
          target="_blank"
          rel="noopener noreferrer"
          href={config.subscribeTwitterLink}
          onClick={() => plausible(`SubscribeBox: Clicked on Twitter`)}
        >
          <FontAwesomeIcon icon={['fab', 'twitter']} />
        </a>
        <a className="btn-square" target="_blank" rel="noopener noreferrer" href={config.subscribeDiscordLink}>
          <FontAwesomeIcon icon={['fab', 'discord']} />
        </a>
        <div className="clearfix" />
        <MessagePanel type={status.state} message={status.message} />
      </form>
    </div>
  )
}
