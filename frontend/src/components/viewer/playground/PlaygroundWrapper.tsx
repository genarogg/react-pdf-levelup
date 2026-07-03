import { useParams } from "react-router-dom"
import Editor from "./index"

function PlaygroundWrapper() {
  const { templateId } = useParams<{ templateId: string }>()
  return <Editor studio={false} templateId={templateId} />
}

export default PlaygroundWrapper
