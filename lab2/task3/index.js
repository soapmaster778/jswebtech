function getGradeTernary(score) {
    return score >= 90 ? "Відмінно" :
        score >= 75 ? "Добре" :
            score >= 50 ? "Задовільно" :
                "Незадовільно";
}

function showGradeTernary() {
    let score = 82;
    alert("Оцінка: " + getGradeTernary(score));
}

function getSeason(month) {

    if (month >= 1 && month <= 12) {

        if (month === 12 || month === 1 || month === 2) {
            return "Зима";
        }
        else if (month >= 3 && month <= 5) {
            return "Весна";
        }
        else if (month >= 6 && month <= 8) {
            return "Літо";
        }
        else {
            return "Осінь";
        }

    } else {
        return "Неправильний номер місяця";
    }
}

function showSeason() {
    let month = 4;
    alert("Сезон: " + getSeason(month));
}