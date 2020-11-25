export function store(initialState) {
  let state = initialState;
  let subscriber = () => { };

  const getState = () => state;

  const set = value => {
    state = value;
    subscriber(state);
  }

  const subscribe = listener => {
    subscriber = listener;
  }

  return { getState, set, subscribe }
}
