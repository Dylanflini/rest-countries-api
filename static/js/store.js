export function store(initialState) {
  let state = initialState;
  let prevState = initialState
  let subscriber = () => { };

  const getState = () => state;

  const set = value => {
    state = value;
    subscriber(state, prevState);
    prevState = value
  }

  const subscribe = listener => {
    subscriber = listener;
  }

  return { getState, set, subscribe }
}
