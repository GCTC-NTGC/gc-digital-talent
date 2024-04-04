global.ClipboardEvent = jest.fn().mockImplementation(() => ({
  getData: jest.fn(),
  setData: jest.fn(),
}));
