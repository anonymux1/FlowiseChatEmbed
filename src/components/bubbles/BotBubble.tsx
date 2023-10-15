import { Show, onMount, createSignal } from 'solid-js'
import { Avatar } from '../avatars/Avatar'
import { Marked } from '@ts-stack/markdown'
import { ThumbsUpOutline } from '../icons/ThumbsupOutline'
import { ThumbsUpFill } from '../icons/ThumbsupFill'
import { ThumbsDownOutline } from '../icons/ThumbsDownOutline'
import { ThumbsDownFill } from '../icons/ThumbsDownFill'

type Props = {
  message: string
  showAvatar?: boolean
  avatarSrc?: string
  backgroundColor?: string
  textColor?: string
  botId?: string
  usermessage: string
}

const defaultBackgroundColor = '#f7f8ff'
const defaultTextColor = '#303235'

const FeedbackAPI = '';

Marked.setOptions({ isNoP: true })

export const BotBubble = (props: Props) => {
    // Define state variables for the button states
    const [isLiked, setIsLiked] = createSignal(false);
    const [isDisliked, setIsDisliked] = createSignal(false);
  
  let botMessageEl: HTMLDivElement | undefined

  onMount(() => {
    if (botMessageEl) {
      botMessageEl.innerHTML = Marked.parse(props.message)
    }
  });
  //Function to make the Feedback API call
  const callApi = async (feedback: boolean) => {
    try {
      const apiData = {
        botId: props.botId,
        userMessage: props.usermessage,
        message: props.message,
        feedback: feedback ? 1 : 0,
      };
      const response = await fetch(FeedbackAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      // Handle the API response if needed
    } catch (error) {
      console.error(error);
      // Handle API call errors
    }
  };

  return (
    <div
      class="flex justify-start mb-2 items-start host-container"
      style={{ 'margin-right': '50px' }}
    >
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} />
      </Show>
      <div class="flex flex-col"> {/* Wrapped buttons and text bubble in a flex container */}
      <div class="flex flex-row items-center"> {/* This flex container will wrap its contents */}
      <span
        ref={botMessageEl}
        class="px-4 py-2 ml-2 whitespace-pre-wrap max-w-full chatbot-host-bubble"
        data-testid="host-bubble"
        style={{ "background-color": props.backgroundColor ?? defaultBackgroundColor, color: props.textColor ?? defaultTextColor, 'border-radius': '6px' }}
      />
        <div class="ml-2"> {/* Horiz. w. ml-2 margin to separate the buttons */}
          <button
            onClick={() => {
              setIsLiked(!isLiked());
              if (isDisliked()) setIsDisliked(false);
              // Call your API for the "👍" action here
              callApi(true);
              // Toggle between the outline and filled thumbs-up icons
              //document.getElementById("thumbsUpButton").innerHTML = isLiked() ? <ThumbsUpFill /> : <ThumbsUpOutline />;
            }}
            class={`like-button ${isLiked() ? 'bg-buttonActive' : ''}`}
            id="thumbsUpButton"
          >
            {isLiked() ? <ThumbsUpFill /> : <ThumbsUpOutline />}
          </button>              
            <div class="mr-1"></div>    
          <button
            onClick={() => {
              setIsDisliked(!isDisliked());
              if (isLiked()) setIsLiked(false);
              // Call your API for the "👎" action here
              callApi(false);
              // Toggle between the outline and filled thumbs-down icons
              //const thumbsDownIcon = isLiked() ? (<ThumbsDownFill />) : (<ThumbsDownOutline />);
            }}
            class={`like-button ${isLiked() ? 'bg-buttonActive' : ''}`}
            id="thumbsDownButton"
          >
            {isDisliked() ? <ThumbsDownFill /> : <ThumbsDownOutline />}
          </button>                         
        </div>      
    </div>
    </div>
    </div>
  );
};
