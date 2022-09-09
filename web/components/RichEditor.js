import { Editor, EditorState } from "draft-js";
import { useEffect, useState } from "react";

export default function RichEditor({ defaultState, placeholder, onChange }) {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

    useEffect(() => {
        if (defaultState) {
            setEditorState(defaultState)
        }
    }, [defaultState])

    const handleChangeEditor = (values) => {
        setEditorState(values)

        onChange(values)
    }

    return (
        <Editor
            editorState={editorState}
            onChange={handleChangeEditor}
            placeholder={placeholder}
        />
    )
}