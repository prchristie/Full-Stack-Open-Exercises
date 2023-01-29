import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notify(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    },
  },
})

export const { notify, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
