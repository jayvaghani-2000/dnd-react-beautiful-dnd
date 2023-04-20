import classNames from "classnames";

export const getDroppableClasses = (col, snapshot) => {
  return classNames("droppableWrapper", {
    ["draggingOver"]: snapshot.isDraggingOver,
  });
};

export const getDraggableStyle = (snapshot, snapshotInner, provider) => ({
  opacity: snapshot.isDraggingOver ? "0.5" : "1",
  boxShadow: snapshotInner.isDragging && "0px 4px 4px rgba(0, 0, 0, 0.25)",
  ...provider.draggableProps.style,
});

export const handleResultAfterDrop = (result, blocks) => {
  const { source, destination, draggableId } = result;

  const { droppableId, index } = source;
  if (!destination) return blocks;

  const { droppableId: destinationDroppableId, index: destinationIndex } =
    destination;

  const updatedBlock = [...blocks];

  const selectedBlock = updatedBlock.findIndex((i) => i.id === draggableId);

  const isDropOnNewRow = +destinationDroppableId % 2 === 0;
  const dropOnRow = +(destinationDroppableId - 1) / 2;

  updatedBlock[selectedBlock].row = +Math.round(dropOnRow);
  updatedBlock[selectedBlock].col = destinationIndex;

  return reArrangeAfterDrop(
    updatedBlock,
    isDropOnNewRow,
    draggableId,
    Math.round(dropOnRow),
    destinationIndex
  )
};

const reArrangeAfterDrop = (
  cards,
  isDropOnNewRow,
  draggableId,
  dropOnId,
  destinationIndex
) => {
  cards.forEach((i, index) => {
    if (isDropOnNewRow) {
      if (i.id !== draggableId && i.row >= dropOnId) {
        i.row += 1;
      }
    } else {
      if (
        i.id !== draggableId &&
        i.col >= destinationIndex &&
        i.row === dropOnId
      ) {
        i.col += 1;
      }
    }
  });

  const rowBlockGroup = cards.reduce((prev, card) => {
    const { row } = card;
    prev[row] = prev[row] ?? [];
    prev[row].push(card);
    return prev;
  }, []);

  const sortedByColumn = getSortedByColRows(rowBlockGroup);

  const rearranged = sortedByColumn
    .filter((i) => i.length)
    .map((group, rowIndex) => {
      group.forEach((block, index) => {
        block.row = rowIndex;
        block.col = index;
      });
      return group;
    });

  return rearranged.flat();
};

const getSortedByColRows = (groups) => {
  return groups.map((group) => {
    return group.sort((a, b) => {
      return a.col - b.col;
    });
  });
};
