/**
 * Returns 404 with error message to client
 * @param  {Object} message message to send
 * @return {Function} middleware
 */
function notFound(message) {
  return (_, response) => response.status(404).json(message)
}

module.exports = notFound
