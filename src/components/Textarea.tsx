import { useState, useRef } from "react";
import { percentage } from "./helper/helper";
import "../styles/Workspace.css";
import "../styles/general.css";

interface Text {
  id: string;
  top: number;
  left: number;
  content: string;
}

export default function Textarea() {
  const [texts, setTexts] = useState<Text[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const workspaceRef = useRef<HTMLDivElement>(null);

  const percentum = percentage(screen.width, 25);

  const handleWorkspaceDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createNewText(y, x);
    e.stopPropagation();
  };

  const createNewText = (top: number, left: number) => {
    const id = crypto.randomUUID();
    setTexts((prev) => [
      ...prev,
      {
        id,
        top,
        left,
        content: "hello",
      },
    ]);
    console.log(percentum);
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLTextAreaElement>,
    id: string
  ) => {
    e.stopPropagation();
    const target = e.target as HTMLTextAreaElement;
    const rect = target.getBoundingClientRect();

    // 🧩 prevent drag when resizing (near bottom-right corner)
    const isNearResize =
      e.clientX > rect.right - 16 && e.clientY > rect.bottom - 16;
    if (isNearResize) return;

    setDraggingId(id);
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId || !workspaceRef.current) return;

    const rect = workspaceRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.current.x;
    const y = e.clientY - rect.top - offset.current.y;

    setTexts((prev) =>
      prev.map((t) =>
        t.id === draggingId ? { ...t, top: y, left: x } : t
      )
    );
    e.stopPropagation();
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div
      ref={workspaceRef}
      className="workspace"
      onDoubleClick={handleWorkspaceDoubleClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {texts.map((text) => (
        <textarea
          key={text.id}
          id={text.id}
          style={{
            position: "absolute",
            top: `${text.top}px`,
            left: `${text.left}px`,
            cursor: "grab",
            resize: "both",
          }}
          className="texts"
          onMouseDown={(e) => handleMouseDown(e, text.id)}
          defaultValue={text.content}
          onDoubleClick={(e) => e.stopPropagation()}
        />
      ))}
    </div>
  );
}
