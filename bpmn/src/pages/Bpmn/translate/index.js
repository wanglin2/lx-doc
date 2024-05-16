import translations from './zh_cn';

export default function translate(template, replacements) {
    
    replacements = replacements || {};

    // Translate
    template = translations[template] || template;

    // Replace
    return template.replace(/{([^}]+)}/g, function (_, key) {
        return replacements[key] || '{' + key + '}';
    });
}