type IsCellRowTitle = (columnId: string, rowTitleId?: string) => boolean;

// Note: To grow
// eslint-disable-next-line import/prefer-default-export
export const isCellRowTitle: IsCellRowTitle = (columnId, rowTitleId) => {
  if (!rowTitleId) return true;

  return !!(rowTitleId === columnId);
};
