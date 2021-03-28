async function register ({
  registerHook,
  storageManager
}) {
  const fieldName = 'my-field-name'

  // Store data associated to this video
  registerHook({
    target: 'action:api.video.updated',
    handler: ({ video, body }) => {
      if (!body.pluginData) return

      const value = body.pluginData[fieldName]
      if (!value) return

      storageManager.storeData(fieldName + '-' + video.id, value)
    }
  })

  // Add your custom value to the video, so the client autofill your field using the previously stored value
  registerHook({
    target: 'filter:api.video.get.result',
    handler: async (video) => {
      if (!video) return video
      if (!video.pluginData) video.pluginData = {}

      const result = await storageManager.getData(fieldName + '-' + video.id)
      video.pluginData[fieldName] = result

      return video
    }
  })
}
