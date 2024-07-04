// All utils functions

module.exports.findUserByGoogleClientId = async (googleClientId) => {
    try {
      const user = await User.findOne({ google_client_id: googleClientId });
      return user;
    } catch (error) {
      console.error('Error finding user by Google Client ID:', error);
      throw error;
    }
}
