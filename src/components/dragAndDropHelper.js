import classNames from "classnames";

export const getDroppableClasses = (col, snapshot) => {
  return classNames("droppableWrapper", {
    ["droppableWithItems"]: col.length,
    ["draggingOver"]: snapshot.isDraggingOver,
  });
};

export const getDraggableStyle = (snapshotInner, provider) => ({
  opacity: snapshot.isDraggingOver ? "0.5" : "1",
  boxShadow: snapshotInner.isDragging && "0px 4px 4px rgba(0, 0, 0, 0.25)",
  ...provider.draggableProps.style,
});
