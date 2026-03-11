// FHIR R4-aligned patient data types (JS-doc for IDE support)

/**
 * @typedef {Object} Vitals
 * @property {number} hr
 * @property {string} bp
 * @property {number} spo2
 * @property {number} temp
 * @property {number} rr
 * @property {number} gcs
 */

/**
 * @typedef {Object} VitalsHistory
 * @property {string} time
 * @property {number} hr
 * @property {number} spo2
 * @property {number} rr
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} route
 * @property {string} freq
 * @property {string|null} alert
 */

/**
 * @typedef {Object} Alert
 * @property {'critical'|'high'|'medium'} severity
 * @property {string} msg
 */

/**
 * @typedef {Object} Patient
 * @property {string} id
 * @property {string} name
 * @property {number} age
 * @property {string} ward
 * @property {string} bed
 * @property {'critical'|'at-risk'|'stable'} status
 * @property {number} newsScore
 * @property {string} admittedDate
 * @property {string} diagnosis
 * @property {string} consultant
 * @property {string[]} allergies
 * @property {Vitals} vitals
 * @property {VitalsHistory[]} vitalsHistory
 * @property {Medication[]} medications
 * @property {Alert[]} alerts
 */