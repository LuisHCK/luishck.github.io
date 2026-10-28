import profile from './profile.json'
import workExperience from './work-experience.json'

/**
 * @typedef DevProfile
 * @type {Object}
 * @property {String} name - Fullname
 * @property {String} title - Developer title
 * @property {String} about - About text
 * @property {String} short_desc - Short description
 * @property {Array<String>} skills - Skills list
 * @property {String} email - Contact email
 * @property {String} linkedin - LinkedIn profile URL
 * @property {String} location - Current location
 * @property {String} cv - Resume URL
 */

/**
 * @type {DevProfile}
 */
export const Profile = profile

/**
 * @typedef WorkExperience
 * @property {String} company
 * @property {String} role
 * @property {String} date
 * @property {String} location
 * @property {String} website
 * @property {String} client
 * @property {Array<String>} highlights
 */

/**
 * @type {Array<WorkExperience>}
 */
export const WorkExp = workExperience
