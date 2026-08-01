import type { SendTextStepSchema } from "@openmeerkat/flow-config"
import type { SendFlowStepProps } from "@openmeerkat/sdk"
import type {
  InstagramAuthValue,
  InstagramMessageAttachment,
  InstagramSendMessage,
} from "../../../schemas"
import { convertInstagramButtons } from "./send-button"

export function* convertFlowStepText(
  props: SendFlowStepProps<InstagramAuthValue, SendTextStepSchema>,
): Generator<InstagramMessageAttachment | InstagramSendMessage> {
  const {
    data: { step },
  } = props
  if (step.buttons.length === 0) {
    yield {
      text: step.text,
    }
  } else {
    const buttons = convertInstagramButtons({
      flowId: props.data.flowId,
      flowVersionId: props.data.flowVersionId,
      buttons: step.buttons,
    })

    yield {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: step.text,
          buttons,
        },
      },
    }
  }
}
