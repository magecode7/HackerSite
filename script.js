// Глобальные переменные
let commandHistory = [];
let historyIndex = -1;
let currentCommand = '';
let attackInProgress = false;
let bootComplete = false;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Запуск загрузочной анимации
    initBootSequence();
    
    // Инициализация терминала после загрузки
    setTimeout(() => {
        initTerminal();
        initSystemStats();
        initDateTime();
        initMatrixBackground();
        initTools();
        
        // Скрыть загрузочный экран
        document.getElementById('boot-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('boot-overlay').style.display = 'none';
            bootComplete = true;
        }, 1000);
    }, 5000); // Время загрузки системы
});

// Функция инициализации загрузочной анимации
function initBootSequence() {
    const bootProgressBar = document.getElementById('boot-progress-bar');
    const bootText = document.getElementById('boot-text');
    
    const bootMessages = [
        'Инициализация системы...',
        'Загрузка ядра...',
        'Проверка целостности файлов...',
        'Подключение к серверам...',
        'Загрузка модулей безопасности...',
        'Обход защиты...',
        'Инициализация интерфейса...',
        'Подключение к теневой сети...',
        'Система готова к работе.'
    ];
    
    let progress = 0;
    let messageIndex = 0;
    let lastIncrement = 0;
    let stuckCounter = 0;
    
    const bootInterval = setInterval(() => {
        // Создаем неравномерную загрузку
        let increment;
        
        // Иногда "застреваем" на загрузке
        if (Math.random() > 0.85 && stuckCounter === 0) {
            increment = 0;
            stuckCounter = Math.floor(Math.random() * 3) + 1;
            
            // Показываем сообщение о проблеме
            const stuckMessages = [
                'Обнаружена ошибка сегментации...',
                'Повторная попытка подключения...',
                'Обход защитного протокола...',
                'Восстановление поврежденных данных...'
            ];
            bootText.textContent = stuckMessages[Math.floor(Math.random() * stuckMessages.length)];
            bootText.classList.add('error-text');
            
            setTimeout(() => {
                bootText.classList.remove('error-text');
            }, 800);
        } else {
            if (stuckCounter > 0) {
                stuckCounter--;
                increment = 0;
            } else {
                // Иногда делаем большой скачок
                if (Math.random() > 0.8) {
                    increment = Math.random() * 20 + 10;
                    bootText.classList.add('success-text');
                    setTimeout(() => {
                        bootText.classList.remove('success-text');
                    }, 300);
                } else {
                    // Обычный прогресс с вариациями
                    increment = Math.random() * 8 + 1;
                }
            }
        }
        
        progress += increment;
        lastIncrement = increment;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(bootInterval);
        }
        
        bootProgressBar.style.width = `${progress}%`;
        
        if (progress > messageIndex * (100 / bootMessages.length) && messageIndex < bootMessages.length) {
            bootText.textContent = bootMessages[messageIndex];
            messageIndex++;
            
            // Добавляем эффект глюка при смене сообщения
            bootText.classList.add('glitch-text');
            setTimeout(() => {
                bootText.classList.remove('glitch-text');
            }, 500);
        }
    }, 200);
}

// Функция инициализации терминала
function initTerminal() {
    const terminal = document.getElementById('terminal-content');
    const commandElement = document.getElementById('command');
    
    // Обработчик клика по терминалу для фокуса
    terminal.addEventListener('click', () => {
        focusTerminal();
    });
    
    // Обработчик нажатия клавиш
    document.addEventListener('keydown', (e) => {
        if (!bootComplete) return;
        
        if (e.key === 'Enter') {
            processCommand();
        } else if (e.key === 'Backspace') {
            if (currentCommand.length > 0) {
                currentCommand = currentCommand.slice(0, -1);
                updateCommandDisplay();
            }
        } else if (e.key === 'ArrowUp') {
            navigateHistory(-1);
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            navigateHistory(1);
            e.preventDefault();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            autocompleteCommand();
        } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            currentCommand += e.key;
            updateCommandDisplay();
        }
    });
    
    // Начальный фокус на терминале
    focusTerminal();
}

// Функция фокуса на терминале
function focusTerminal() {
    const cursor = document.querySelector('.cursor');
    cursor.classList.add('blink');
}

// Функция обновления отображения команды
function updateCommandDisplay() {
    const commandElement = document.getElementById('command');
    commandElement.textContent = currentCommand;
}

// Функция обработки введенной команды
function processCommand() {
    if (currentCommand.trim() === '') return;
    
    // Добавляем команду в историю
    commandHistory.push(currentCommand);
    historyIndex = commandHistory.length;
    
    // Создаем новую строку с командой
    const terminal = document.getElementById('terminal-content');
    const commandLine = document.querySelector('.command-line');
    const newCommandLine = document.createElement('div');
    newCommandLine.className = 'line';
    newCommandLine.innerHTML = `<span class="prompt">root@h4ck3r:~# </span>${currentCommand}`;
    terminal.insertBefore(newCommandLine, commandLine);
    
    // Обрабатываем команду
    handleCommand(currentCommand);
    
    // Очищаем текущую команду
    currentCommand = '';
    updateCommandDisplay();
    
    // Прокручиваем терминал вниз
    terminal.scrollTop = terminal.scrollHeight;
}

// Функция обработки команд
function handleCommand(cmd) {
    const terminal = document.getElementById('terminal-content');
    const commandLine = document.querySelector('.command-line');
    let response;
    
    cmd = cmd.toLowerCase().trim();
    
    switch (cmd) {
        case 'help':
            response = [
                'Доступные команды:',
                '  help       - показать список команд',
                '  clear      - очистить терминал',
                '  scan       - сканировать сеть',
                '  brute      - запустить брутфорс пароля',
                '  decrypt    - запустить дешифровку',
                '  exploit    - запустить эксплойт',
                '  ddos       - запустить DDOS атаку',
                '  backdoor   - установить бэкдор',
                '  rootkit    - внедрить руткит',
                '  ransom     - запустить шифрование',
                '  phish      - создать фишинговую страницу',
                '  spoof      - подменить MAC адрес',
                '  sniff      - запустить сниффер пакетов',
                '  proxy      - настроить анонимный прокси',
                '  tunnel     - создать SSH туннель',
                '  ip         - показать текущий IP',
                '  status     - показать статус системы',
                '  matrix     - включить/выключить матричный фон',
                '  trace      - запустить трассировку',
                '  firewall   - отключить файрвол',
                '  logs       - очистить системные логи'
            ];
            break;
            
        case 'clear':
            // Удаляем все строки кроме строки ввода
            const lines = terminal.querySelectorAll('.line:not(.command-line)');
            lines.forEach(line => terminal.removeChild(line));
            return;
            
        case 'scan':
        case 'brute':
        case 'decrypt':
        case 'exploit':
        case 'ddos':
        case 'backdoor':
        case 'rootkit':
        case 'ransom':
        case 'phish':
        case 'sniff':
        case 'tunnel':
        case 'trace':
        case 'firewall':
            startAttack(cmd);
            response = [`Запуск операции: ${cmd.toUpperCase()}...`];
            break;
            
        case 'ip':
            const ip = generateRandomIP();
            document.getElementById('ip-address').textContent = `IP: ${ip}`;
            response = [`Текущий IP адрес: ${ip}`];
            break;
            
        case 'spoof':
            const mac = generateRandomMAC();
            response = [
                `Подмена MAC адреса...`,
                `Старый MAC: ${generateRandomMAC()}`,
                `Новый MAC: ${mac}`,
                `MAC адрес успешно изменен`
            ];
            break;
            
        case 'proxy':
            response = [
                'Настройка анонимного прокси...',
                `Подключение к узлу: ${generateRandomIP()}`,
                'Маршрутизация через TOR...',
                'Прокси успешно настроен',
                `Ваш новый внешний IP: ${generateRandomIP()}`
            ];
            break;
            
        case 'logs':
            response = [
                'Поиск системных логов...',
                'Найдено логов: ' + Math.floor(Math.random() * 1000 + 500),
                'Очистка логов...',
                'Удаление следов активности...',
                'Логи успешно очищены'
            ];
            break;
            
        case 'status':
            const cpuValue = document.getElementById('cpu-value').textContent;
            const ramValue = document.getElementById('ram-value').textContent;
            const networkValue = document.getElementById('network-value').textContent;
            response = [
                'Статус системы:',
                `CPU: ${cpuValue}`,
                `RAM: ${ramValue}`,
                `СЕТЬ: ${networkValue}`,
                'Статус: АКТИВНА',
                'Анонимность: ВЫСОКАЯ',
                'Обнаружение: НЕТ'
            ];
            break;
            
        case 'matrix':
            toggleMatrixBackground();
            response = ['Переключение матричного фона'];
            break;
            
        default:
            if (cmd.startsWith('cd ')) {
                response = [`Переход в директорию: ${cmd.substring(3)}`];
            } else if (cmd.startsWith('cat ')) {
                response = [`Файл ${cmd.substring(4)} не найден.`];
            } else if (cmd.startsWith('hack ')) {
                const target = cmd.substring(5);
                response = [
                    `Попытка взлома цели: ${target}`,
                    'Поиск уязвимостей...',
                    'Уязвимость найдена: SQL Injection',
                    'Эксплуатация уязвимости...',
                    'Доступ получен!'
                ];
            } else {
                response = [`Команда не распознана: ${cmd}`, 'Введите "help" для списка команд.'];
            }
    }
    
    // Добавляем ответ в терминал
    response.forEach(line => {
        const responseLine = document.createElement('div');
        responseLine.className = 'line';
        responseLine.textContent = line;
        terminal.insertBefore(responseLine, commandLine);
    });
}

// Функция навигации по истории команд
function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    
    historyIndex += direction;
    
    if (historyIndex < 0) historyIndex = 0;
    if (historyIndex > commandHistory.length) historyIndex = commandHistory.length;
    
    if (historyIndex === commandHistory.length) {
        currentCommand = '';
    } else {
        currentCommand = commandHistory[historyIndex];
    }
    
    updateCommandDisplay();
}

// Функция автодополнения команд
function autocompleteCommand() {
    const commands = ['help', 'clear', 'scan', 'brute', 'decrypt', 'exploit', 'ddos', 'ip', 'status', 'matrix'];
    
    for (const cmd of commands) {
        if (cmd.startsWith(currentCommand.toLowerCase())) {
            currentCommand = cmd;
            updateCommandDisplay();
            break;
        }
    }
}

// Функция инициализации системных статистик
function initSystemStats() {
    updateSystemStats();
    setInterval(updateSystemStats, 2000);
}

// Функция обновления системных статистик
function updateSystemStats() {
    const cpuProgress = document.getElementById('cpu-progress');
    const ramProgress = document.getElementById('ram-progress');
    const networkProgress = document.getElementById('network-progress');
    const cpuValue = document.getElementById('cpu-value');
    const ramValue = document.getElementById('ram-value');
    const networkValue = document.getElementById('network-value');
    
    // Генерируем случайные значения
    const cpu = Math.floor(Math.random() * 60) + 10;
    const ram = Math.floor(Math.random() * 40) + 30;
    const network = Math.floor(Math.random() * 1000);
    
    // Обновляем прогресс-бары
    cpuProgress.style.width = `${cpu}%`;
    ramProgress.style.width = `${ram}%`;
    networkProgress.style.width = `${network / 10}%`;
    
    // Обновляем текстовые значения
    cpuValue.textContent = `${cpu}%`;
    ramValue.textContent = `${ram}%`;
    networkValue.textContent = `${network} Kb/s`;
    
    // Добавляем эффект мерцания при высоких значениях
    if (cpu > 50) cpuValue.classList.add('warning-text');
    else cpuValue.classList.remove('warning-text');
    
    if (ram > 60) ramValue.classList.add('warning-text');
    else ramValue.classList.remove('warning-text');
    
    if (network > 800) networkValue.classList.add('warning-text');
    else networkValue.classList.remove('warning-text');
}

// Функция инициализации даты и времени
function initDateTime() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Функция обновления даты и времени
function updateDateTime() {
    const dateTimeElement = document.getElementById('date-time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    dateTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Функция генерации случайного IP-адреса
function generateRandomIP() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Функция генерации случайного MAC-адреса
function generateRandomMAC() {
    const hexDigits = "0123456789ABCDEF";
    let mac = "";
    for (let i = 0; i < 6; i++) {
        mac += hexDigits.charAt(Math.floor(Math.random() * 16)) + hexDigits.charAt(Math.floor(Math.random() * 16));
        if (i < 5) mac += ":";
    }
    return mac;
}

// Функция инициализации матричного фона
function initMatrixBackground() {
    const container = document.querySelector('.container');
    const matrixBg = document.createElement('canvas');
    matrixBg.className = 'matrix-bg';
    document.body.insertBefore(matrixBg, container);
    
    const ctx = matrixBg.getContext('2d');
    matrixBg.width = window.innerWidth;
    matrixBg.height = window.innerHeight;
    
    // Символы для матрицы
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*(){}[]<>~`|\\';
    const fontSize = 14;
    const columns = matrixBg.width / fontSize;
    
    // Массив для хранения позиции Y каждой колонки
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    // Функция отрисовки матрицы
    function drawMatrix() {
        // Полупрозрачный черный фон для создания эффекта затухания
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrixBg.width, matrixBg.height);
        
        // Зеленый текст
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px monospace`;
        
        // Отрисовка символов
        for (let i = 0; i < drops.length; i++) {
            // Случайный символ
            const text = chars[Math.floor(Math.random() * chars.length)];
            
            // x = i * размер шрифта, y = значение[i] * размер шрифта
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Если достигнут низ или случайно - сбрасываем
            if (drops[i] * fontSize > matrixBg.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Увеличиваем Y
            drops[i]++;
        }
    }
    
    // Запускаем анимацию
    setInterval(drawMatrix, 50);
}

// Функция переключения матричного фона
function toggleMatrixBackground() {
    const matrixBg = document.querySelector('.matrix-bg');
    if (matrixBg.style.display === 'none') {
        matrixBg.style.display = 'block';
    } else {
        matrixBg.style.display = 'none';
    }
}

// Функция инициализации инструментов
function initTools() {
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            const command = tool.getAttribute('data-command');
            if (command) {
                currentCommand = command;
                updateCommandDisplay();
                processCommand();
            }
        });
    });
}

// Функция запуска атаки
function startAttack(type) {
    if (attackInProgress) return;
    attackInProgress = true;
    
    // Настройка модального окна атаки
    const modal = document.getElementById('attack-modal');
    const attackTitle = document.getElementById('attack-title');
    const attackLog = document.getElementById('attack-log');
    const attackProgressBar = document.getElementById('attack-progress-bar');
    const targetValue = document.getElementById('target-value');
    const targetStatus = document.getElementById('target-status');
    const attackVisual = document.getElementById('attack-visual');
    
    // Очищаем предыдущие данные
    attackLog.innerHTML = '';
    attackProgressBar.style.width = '0%';
    
    // Настраиваем в зависимости от типа атаки
    let title, target, duration, logMessages;
    
    switch (type) {
        case 'scan':
            title = 'СКАНИРОВАНИЕ СЕТИ';
            target = generateRandomIP() + '/24';
            duration = 10000;
            logMessages = [
                'Инициализация сканера...',
                'Определение активных хостов...',
                'Сканирование портов...',
                'Определение сервисов...',
                'Поиск уязвимостей...',
                'Составление отчета...'
            ];
            // Создаем анимацию сканирования
            attackVisual.classList.add('scan-animation');
            attackProgressBar.style.backgroundColor = 'var(--scan-color)';
            break;
            
        case 'brute':
            title = 'БРУТФОРС ПАРОЛЯ';
            target = 'admin@' + generateRandomIP();
            duration = 15000;
            logMessages = [
                'Инициализация словаря...',
                'Проверка простых паролей...',
                'Генерация комбинаций...',
                'Тестирование комбинаций...',
                'Обход защиты от перебора...',
                'Поиск хеша в базе данных...',
                'Расшифровка пароля...'
            ];
            // Создаем анимацию брутфорса
            attackVisual.classList.add('brute-animation');
            attackProgressBar.style.backgroundColor = 'var(--brute-color)';
            break;
            
        case 'decrypt':
            title = 'ДЕШИФРОВКА ДАННЫХ';
            target = 'encrypted_data_' + Math.floor(Math.random() * 1000) + '.bin';
            duration = 12000;
            logMessages = [
                'Анализ алгоритма шифрования...',
                'Определение ключа...',
                'Подбор параметров...',
                'Запуск процесса дешифровки...',
                'Проверка целостности данных...',
                'Восстановление структуры...'
            ];
            // Создаем анимацию дешифровки
            attackVisual.classList.add('decrypt-animation');
            attackProgressBar.style.backgroundColor = 'var(--decrypt-color)';
            break;
            
        case 'exploit':
            title = 'ЭКСПЛУАТАЦИЯ УЯЗВИМОСТИ';
            target = 'server_' + Math.floor(Math.random() * 100) + '@' + generateRandomIP();
            duration = 8000;
            logMessages = [
                'Поиск уязвимостей...',
                'Подготовка эксплойта...',
                'Обход защиты...',
                'Внедрение полезной нагрузки...',
                'Повышение привилегий...',
                'Установка бэкдора...'
            ];
            // Создаем анимацию эксплойта
            attackVisual.classList.add('exploit-animation');
            attackProgressBar.style.backgroundColor = 'var(--exploit-color)';
            break;
            
        case 'ddos':
            title = 'DDOS АТАКА';
            target = generateRandomIP() + ':80';
            duration = 20000;
            logMessages = [
                'Подготовка ботнета...',
                'Синхронизация атаки...',
                'Отправка SYN-пакетов...',
                'Увеличение нагрузки...',
                'Обход защиты от DDoS...',
                'Поддержание атаки...',
                'Мониторинг состояния цели...'
            ];
            // Создаем анимацию DDOS
            attackVisual.classList.add('ddos-animation');
            attackProgressBar.style.backgroundColor = 'var(--ddos-color)';
            break;
            
        case 'backdoor':
            title = 'УСТАНОВКА БЭКДОРА';
            target = 'system@' + generateRandomIP();
            duration = 12000;
            logMessages = [
                'Анализ целевой системы...',
                'Поиск точки входа...',
                'Компиляция бэкдора...',
                'Обфускация кода...',
                'Внедрение в систему...',
                'Настройка автозапуска...',
                'Маскировка следов...'
            ];
            // Создаем анимацию бэкдора
            attackVisual.classList.add('backdoor-animation');
            attackProgressBar.style.backgroundColor = 'var(--backdoor-color)';
            break;
            
        case 'rootkit':
            title = 'ВНЕДРЕНИЕ РУТКИТА';
            target = 'kernel@' + generateRandomIP();
            duration = 18000;
            logMessages = [
                'Анализ ядра системы...',
                'Поиск уязвимостей драйверов...',
                'Компиляция руткита...',
                'Обход защиты...',
                'Внедрение в ядро...',
                'Перехват системных вызовов...',
                'Скрытие процессов...',
                'Настройка персистентности...'
            ];
            // Создаем анимацию руткита
            attackVisual.classList.add('rootkit-animation');
            attackProgressBar.style.backgroundColor = 'var(--rootkit-color)';
            break;
            
        case 'ransom':
            title = 'ШИФРОВАНИЕ ДАННЫХ';
            target = 'filesystem@' + generateRandomIP();
            duration = 15000;
            logMessages = [
                'Сканирование файловой системы...',
                'Поиск ценных данных...',
                'Генерация ключей шифрования...',
                'Шифрование файлов...',
                'Удаление оригиналов...',
                'Создание записки с требованием...',
                'Блокировка системы...'
            ];
            // Создаем анимацию шифрования
            attackVisual.classList.add('ransom-animation');
            attackProgressBar.style.backgroundColor = 'var(--ransom-color)';
            break;
            
        case 'phish':
            title = 'СОЗДАНИЕ ФИШИНГА';
            target = 'users@' + generateRandomIP();
            duration = 10000;
            logMessages = [
                'Клонирование целевого сайта...',
                'Модификация форм ввода...',
                'Настройка перехвата данных...',
                'Обход фильтров спама...',
                'Генерация фишинговых URL...',
                'Подготовка рассылки...',
                'Запуск кампании...'
            ];
            // Создаем анимацию фишинга
            attackVisual.classList.add('phish-animation');
            attackProgressBar.style.backgroundColor = 'var(--phish-color)';
            break;
            
        case 'sniff':
            title = 'ПЕРЕХВАТ ПАКЕТОВ';
            target = 'network@' + generateRandomIP();
            duration = 14000;
            logMessages = [
                'Переключение сетевой карты в режим мониторинга...',
                'Настройка фильтров перехвата...',
                'Запуск анализатора пакетов...',
                'Перехват сетевого трафика...',
                'Поиск незашифрованных данных...',
                'Извлечение учетных данных...',
                'Анализ протоколов...'
            ];
            // Создаем анимацию снифера
            attackVisual.classList.add('sniff-animation');
            attackProgressBar.style.backgroundColor = 'var(--sniff-color)';
            break;
            
        case 'tunnel':
            title = 'СОЗДАНИЕ SSH ТУННЕЛЯ';
            target = 'gateway@' + generateRandomIP();
            duration = 8000;
            logMessages = [
                'Подключение к удаленному серверу...',
                'Аутентификация по ключу...',
                'Настройка перенаправления портов...',
                'Установка туннеля...',
                'Проверка соединения...',
                'Маскировка трафика...',
                'Туннель активирован'
            ];
            // Создаем анимацию туннеля
            attackVisual.classList.add('tunnel-animation');
            attackProgressBar.style.backgroundColor = 'var(--tunnel-color)';
            break;
            
        case 'trace':
            title = 'ТРАССИРОВКА МАРШРУТА';
            target = generateRandomIP();
            duration = 12000;
            logMessages = [
                'Инициализация трассировки...',
                'Отправка пакетов...',
                'Анализ маршрута...',
                'Определение промежуточных узлов...',
                'Проверка задержек...',
                'Поиск оптимального пути...',
                'Составление карты сети...'
            ];
            // Создаем анимацию трассировки
            attackVisual.classList.add('trace-animation');
            attackProgressBar.style.backgroundColor = 'var(--trace-color)';
            break;
            
        case 'firewall':
            title = 'ОТКЛЮЧЕНИЕ ФАЙРВОЛА';
            target = 'security@' + generateRandomIP();
            duration = 10000;
            logMessages = [
                'Анализ правил файрвола...',
                'Поиск уязвимостей...',
                'Обход защиты...',
                'Модификация правил...',
                'Создание исключений...',
                'Отключение оповещений...',
                'Открытие портов...',
                'Файрвол отключен'
            ];
            // Создаем анимацию отключения файрвола
            attackVisual.classList.add('firewall-animation');
            attackProgressBar.style.backgroundColor = 'var(--firewall-color)';
            break;
    }
    
    // Настраиваем интерфейс
    attackTitle.textContent = title;
    targetValue.textContent = target;
    targetStatus.textContent = 'В ПРОЦЕССЕ';
    
    // Добавляем общие визуальные эффекты для всех типов атак
    const scanLine = document.createElement('div');
    scanLine.className = 'scan-line';
    attackVisual.appendChild(scanLine);
    
    // Показываем модальное окно
    modal.style.display = 'flex';
    
    // Запускаем прогресс
    let progress = 0;
    let logIndex = 0;
    let stuckCounter = 0;
    let speedFactor = 1;
    
    const progressInterval = setInterval(() => {
        // Создаем неравномерную загрузку
        let increment;
        
        // Иногда "застреваем" на загрузке
        if (Math.random() > 0.85 && stuckCounter === 0) {
            increment = 0;
            stuckCounter = Math.floor(Math.random() * 4) + 1;
            
            // Добавляем сообщение об ошибке
            const errorLog = document.createElement('div');
            const errorMessages = [
                'Обнаружена защита! Попытка обхода...',
                'Потеряно соединение. Переподключение...',
                'Ошибка доступа. Повышение привилегий...',
                'Обнаружена антивирусная активность. Маскировка...',
                'Блокировка по IP. Смена прокси...'
            ];
            errorLog.textContent = `[${new Date().toLocaleTimeString()}] ${errorMessages[Math.floor(Math.random() * errorMessages.length)]}`;
            errorLog.className = 'error-text';
            attackLog.appendChild(errorLog);
            attackLog.scrollTop = attackLog.scrollHeight;
        } else {
            if (stuckCounter > 0) {
                stuckCounter--;
                increment = 0;
            } else {
                // Иногда делаем большой скачок
                if (Math.random() > 0.8) {
                    speedFactor = Math.random() * 3 + 2; // Ускорение в 2-5 раз
                    
                    // Добавляем сообщение об ускорении
                    const speedLog = document.createElement('div');
                    speedLog.textContent = `[${new Date().toLocaleTimeString()}] Найдено уязвимое место! Ускорение процесса...`;
                    speedLog.className = 'success-text';
                    attackLog.appendChild(speedLog);
                    attackLog.scrollTop = attackLog.scrollHeight;
                } else if (Math.random() > 0.9) {
                    speedFactor = Math.random() * 0.5 + 0.2; // Замедление до 0.2-0.7 от нормы
                } else {
                    speedFactor = Math.random() * 0.5 + 0.8; // Нормальная скорость с вариациями
                }
                
                increment = (100 / (duration / 200)) * speedFactor;
            }
        }
        
        progress += increment;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Завершаем атаку
            targetStatus.textContent = 'УСПЕШНО';
            targetStatus.className = 'target-status-value success-text';
            
            // Добавляем финальное сообщение
            const finalLog = document.createElement('div');
            finalLog.textContent = `[${new Date().toLocaleTimeString()}] Операция завершена успешно!`;
            finalLog.className = 'success-text';
            attackLog.appendChild(finalLog);
            
            // Закрываем модальное окно через некоторое время
            setTimeout(() => {
                modal.style.display = 'none';
                attackInProgress = false;
                
                // Удаляем визуальные эффекты и сбрасываем классы анимаций
                attackVisual.innerHTML = '';
                attackVisual.className = 'attack-visual';
                attackProgressBar.style.backgroundColor = '';
            }, 3000);
        }
        
        // Обновляем прогресс-бар
        attackProgressBar.style.width = `${progress}%`;
        
        // Добавляем сообщения в лог
        if (logIndex < logMessages.length && progress > (logIndex + 1) * (100 / (logMessages.length + 1))) {
            const log = document.createElement('div');
            log.textContent = `[${new Date().toLocaleTimeString()}] ${logMessages[logIndex]}`;
            attackLog.appendChild(log);
            attackLog.scrollTop = attackLog.scrollHeight;
            logIndex++;
        }
        
        // Добавляем случайные технические сообщения
        if (Math.random() > 0.7) {
            const techLog = document.createElement('div');
            const techMessages = [
                'Пакетов отправлено: ' + Math.floor(Math.random() * 10000),
                'Соединений: ' + Math.floor(Math.random() * 100),
                'Задержка: ' + Math.floor(Math.random() * 200) + 'ms',
                'Буфер: ' + Math.floor(Math.random() * 100) + '%',
                'Проверка контрольной суммы...',
                'Обход файрвола...',
                'Маскировка трафика...'
            ];
            techLog.textContent = `[${new Date().toLocaleTimeString()}] ${techMessages[Math.floor(Math.random() * techMessages.length)]}`;
            techLog.style.color = '#aaa';
            attackLog.appendChild(techLog);
            attackLog.scrollTop = attackLog.scrollHeight;
        }
    }, 200);
    
    // Обработчик закрытия модального окна
    const closeModal = document.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        clearInterval(progressInterval);
        attackInProgress = false;
        attackVisual.innerHTML = '';
        attackVisual.className = 'attack-visual';
        attackProgressBar.style.backgroundColor = '';
    });
}

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
    const matrixBg = document.querySelector('.matrix-bg');
    if (matrixBg) {
        matrixBg.width = window.innerWidth;
        matrixBg.height = window.innerHeight;
    }
    
    // Адаптация интерфейса при изменении размера окна
    adjustInterfaceForScreenSize();
});

// Функция адаптации интерфейса под размер экрана
function adjustInterfaceForScreenSize() {
    const width = window.innerWidth;
    const terminal = document.querySelector('.terminal-content');
    const sidebar = document.querySelector('.sidebar');
    const tools = document.querySelectorAll('.tool');
    
    // Адаптация размера шрифта терминала
    if (width < 600) {
        terminal.style.fontSize = '12px';
        tools.forEach(tool => {
            tool.style.padding = '6px';
            tool.style.marginBottom = '4px';
        });
    } else if (width < 1024) {
        terminal.style.fontSize = '14px';
        tools.forEach(tool => {
            tool.style.padding = '8px';
            tool.style.marginBottom = '6px';
        });
    } else {
        terminal.style.fontSize = '16px';
        tools.forEach(tool => {
            tool.style.padding = '10px';
            tool.style.marginBottom = '8px';
        });
    }
}

// Вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Существующий код инициализации...
    
    // Добавляем адаптацию интерфейса
    adjustInterfaceForScreenSize();
});
