function getUserLanguage() {
    const rawLang = navigator.language || navigator.userLanguage; // ユーザーの言語を取得
    const userLang = rawLang.split('-')[0];

    return userLang;
}