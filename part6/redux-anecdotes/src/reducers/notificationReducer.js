import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notify(state, action) {
      console.log(action.payload)
      return action.payload
    },
    clearNotification() {
      return ''
    },
  },
})

export const { notify, clearNotification } = notificationSlice.actions

export const setNotification = (message, displayTime) => {
  return (dispatch) => {
    dispatch(notify(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, displayTime * 1000)
  }
}
export default notificationSlice.reducer
