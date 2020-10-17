export const state = () => ({
  currentActivityTab: 'index'
});

export const mutations = {
  setCurrentActivityTab(state, currentActivityTab) {
    state.currentActivityTab = currentActivityTab;
  }
}
