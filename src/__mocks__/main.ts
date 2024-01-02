// Mock the action's entrypoint
export const runMock = jest.fn()

// Mock the 'main' module
const mock = jest.fn().mockImplementation(() => {
  return { run: runMock }
})

export default mock
