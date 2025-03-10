import { supabase } from './src/services/supabase.js';
import { useTelegram } from './src/services/telegram.js';

const { user } = useTelegram();
const MY_ID = parseInt(user?.id ?? '4252', 10);
console.log('MY_ID:', MY_ID);   

async function getOrCreateUser() {
    try {
        console.log('Проверяем пользователя с telegram:', MY_ID);
        // Проверяем, существует ли пользователь в базе данных по telegram
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('telegram', MY_ID)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Ошибка при проверке пользователя:', checkError.message);
            return null;
        }

        // Если пользователь существует, возвращаем его данные
        if (existingUser) {
            console.log('Найден существующий пользователь:', existingUser);
            return existingUser;
        }

        // Если пользователь не существует, создаем нового
        console.log('Создаем нового пользователя с telegram:', MY_ID);
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([{
                telegram: MY_ID,
                score: 0,
                max_health: 100,
                damage_multiplier: 1.0,
                missions: {
                    1: { killed: 0, completed: false },
                    2: { score: 0, completed: false },
                    3: { time: 0, completed: false },
                    4: { killed: 0, completed: false },
                    5: { killed: 0, completed: false },
                    6: { score: 0, completed: false },
                    7: { time: 0, completed: false },
                    8: { noReloadKills: 0, completed: false },
                    9: { quickKills: 0, completed: false },
                    10: { distance: 0, completed: false },
                    11: { noDamageKills: 0, completed: false },
                    12: { score: 0, completed: false },
                    13: { time: 0, completed: false },
                    14: { killed: 0, completed: false },
                    15: { level: 0, completed: false },
                    16: { shopItems: 0, completed: false },
                    17: { killed: 0, completed: false },
                    18: { time: 0, completed: false },
                    19: { score: 0, completed: false },
                    20: { completed: false }
                }
            }])
            .select()
            .single();

        if (createError) {
            console.error('Ошибка при создании пользователя:', createError.message);
            return null;
        }

        console.log('Создан новый пользователь:', newUser);
        return newUser;
    } catch (error) {
        console.error('Непредвиденная ошибка:', error);
        return null;
    }
}

const GameData = {
    totalScore: 0,
    maxHealth: 100,
    damageMultiplier: 1,
    maxAmmo: 30,
    reloadSpeed: 1,
    healthRegen: 0,
    moveSpeed: 1,
    damageReduction: 1,
    boughtItems: {},
    missions: {
        1: { killed: 0, completed: false },
        2: { score: 0, completed: false },
        3: { time: 0, completed: false },
        4: { killed: 0, completed: false },
        5: { killed: 0, completed: false },
        6: { score: 0, completed: false },
        7: { time: 0, completed: false },
        8: { noReloadKills: 0, completed: false },
        9: { quickKills: 0, completed: false },
        10: { distance: 0, completed: false },
        11: { noDamageKills: 0, completed: false },
        12: { score: 0, completed: false },
        13: { time: 0, completed: false },
        14: { killed: 0, completed: false },
        15: { level: 0, completed: false },
        16: { shopItems: 0, completed: false },
        17: { killed: 0, completed: false },
        18: { time: 0, completed: false },
        19: { score: 0, completed: false },
        20: { completed: false }
    },
    
    async save() {
        // Сохраняем в localStorage как резервную копию
        localStorage.setItem('scp2947ShooterData', JSON.stringify({
            maxHealth: this.maxHealth,
            damageMultiplier: this.damageMultiplier,
            missions: this.missions,
            totalScore: this.totalScore,
            maxAmmo: this.maxAmmo,
            reloadSpeed: this.reloadSpeed,
            healthRegen: this.healthRegen,
            moveSpeed: this.moveSpeed,
            damageReduction: this.damageReduction,
            boughtItems: this.boughtItems
        }));

        try {
            console.log('Сохранение данных для пользователя:', MY_ID, 'Score:', this.totalScore);
            const { error } = await supabase
                .from('users')
                .update({
                    score: this.totalScore,
                    max_health: this.maxHealth,
                    damage_multiplier: this.damageMultiplier,
                    missions: this.missions,
                    max_ammo: this.maxAmmo,
                    reload_speed: this.reloadSpeed,
                    health_regen: this.healthRegen,
                    move_speed: this.moveSpeed,
                    damage_reduction: this.damageReduction,
                    bought_items: this.boughtItems
                })
                .eq('telegram', MY_ID);

            if (error) {
                console.error('Ошибка сохранения в БД:', error.message);
                throw error;
            }
            console.log('Данные успешно сохранены');
        } catch (error) {
            console.error('Ошибка сохранения в БД:', error);
        }
    },
    
    async load() {
        try {
            console.log('Загрузка данных для пользователя:', MY_ID);
            const user = await getOrCreateUser();
            
            if (user) {
                console.log('Загружены данные пользователя:', user);
                this.totalScore = user.score || 0;
                this.maxHealth = user.max_health || 100;
                this.damageMultiplier = user.damage_multiplier || 1;
                this.missions = user.missions || this.missions;
                this.maxAmmo = user.max_ammo || 30;
                this.reloadSpeed = user.reload_speed || 1;
                this.healthRegen = user.health_regen || 0;
                this.moveSpeed = user.move_speed || 1;
                this.damageReduction = user.damage_reduction || 1;
                this.boughtItems = user.bought_items || {};
            } else {
                console.log('Использование данных из localStorage');
                const localData = localStorage.getItem('scp2947ShooterData');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    this.totalScore = parsed.totalScore || 0;
                    this.maxHealth = parsed.maxHealth || 100;
                    this.damageMultiplier = parsed.damageMultiplier || 1;
                    this.missions = parsed.missions || this.missions;
                    this.maxAmmo = parsed.maxAmmo || 30;
                    this.reloadSpeed = parsed.reloadSpeed || 1;
                    this.healthRegen = parsed.healthRegen || 0;
                    this.moveSpeed = parsed.moveSpeed || 1;
                    this.damageReduction = parsed.damageReduction || 1;
                    this.boughtItems = parsed.boughtItems || {};
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            const localData = localStorage.getItem('scp2947ShooterData');
            if (localData) {
                const parsed = JSON.parse(localData);
                this.totalScore = parsed.totalScore || 0;
                this.maxHealth = parsed.maxHealth || 100;
                this.damageMultiplier = parsed.damageMultiplier || 1;
                this.missions = parsed.missions || this.missions;
                this.maxAmmo = parsed.maxAmmo || 30;
                this.reloadSpeed = parsed.reloadSpeed || 1;
                this.healthRegen = parsed.healthRegen || 0;
                this.moveSpeed = parsed.moveSpeed || 1;
                this.damageReduction = parsed.damageReduction || 1;
                this.boughtItems = parsed.boughtItems || {};
            }
        }
        
        this.updateUI();
    },
    
    updateUI() {
        document.getElementById('total-score').textContent = this.totalScore;
    }
};

function requestFullscreen() {
    if (window.Telegram && window.Telegram.WebApp) {
        // Используем expand() вместо requestFullscreen
        window.Telegram.WebApp.expand();
    } else {
        // Пробуем использовать стандартный API полноэкранного режима
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen().catch(err => {
                console.warn('Ошибка включения полноэкранного режима:', err);
            });
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else {
            console.warn("Полноэкранный режим не поддерживается");
        }
    }
}

class ZombieShooter {
    constructor() {
        this.mounted();
    }

    async mounted() {
        // Запускаем полноэкранный режим
        this.requestFullscreen();
        
        // Инициализация игры
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('game'),
            antialias: true
        });
        
        // Устанавливаем размер на весь экран
        this.renderer.setSize(window.screen.width, window.screen.height);
        this.renderer.setClearColor(0x000000);
        
        // Обновляем пропорции камеры
        this.camera.aspect = window.screen.width / window.screen.height;
        this.camera.updateProjectionMatrix();
        
        // Загрузка звука выстрела
        this.shootSound = new Audio('./pistolet_zvuk.mp3');
        this.shootSound.addEventListener('error', (e) => {
            console.error('Ошибка загрузки звука:', e);
        });
        this.shootSound.addEventListener('canplaythrough', () => {
            console.log('Звук успешно загружен');
        });
        
        // Загрузка текстуры земли
        this.loadTextures();
        
        // Игровые переменные
        this.initGameVariables();
        
        // Настройка сцены
        this.setupScene();
        this.setupLights();
        this.setupPlayer();
        this.setupControls();
        
        // Запуск игры
        this.lastTime = performance.now();
        this.animate();
        this.spawnSCP2947s();

        // Добавляем обработчик изменения размера окна
        window.addEventListener('resize', () => this.handleResize());
    }

    requestFullscreen() {
        if (window.Telegram && window.Telegram.WebApp) {
            // В Telegram WebApp используем expand()
            window.Telegram.WebApp.expand();
        } else {
            // Для обычного браузера используем стандартный API
            const element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen().catch(err => {
                    console.warn('Ошибка включения полноэкранного режима:', err);
                });
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    }

    handleResize() {
        if (!this.renderer || !this.camera) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        const textureUrl = './texture.png';
        console.log('Попытка загрузки текстуры:', textureUrl);
        
        this.groundTexture = textureLoader.load(
            textureUrl, 
            (texture) => {
                console.log('Текстура успешно загружена');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(4, 4);
                if (this.floor) {
                    this.floor.material.map = texture;
                    this.floor.material.needsUpdate = true;
                }
            },
            (progress) => {
                const percent = (progress.loaded / progress.total * 100).toFixed(2);
                console.log('Загрузка текстуры:', percent + '%');
            },
            (error) => {
                console.error('Ошибка загрузки текстуры:', error);
                // Установка цвета по умолчанию при ошибке загрузки
                if (this.floor) {
                    this.floor.material.color.setHex(0x4a7023);
                    this.floor.material.needsUpdate = true;
                }
            }
        );
    }

    initGameVariables() {
        this.score = 0;
        this.health = GameData.maxHealth;
        this.ammo = GameData.maxAmmo;
        this.isGameOver = false;
        this.scp2947s = [];
        this.bullets = [];
        this.gameTime = 0;
        this.scp2947sKilled = 0;
        
        // Новые переменные для заданий
        this.lastKillTime = 0;
        this.killsWithoutReload = 0;
        this.killsWithoutDamage = 0;
        this.quickKills = 0;
        this.distanceTraveled = 0;
        this.lastPosition = this.camera.position.clone();
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 1000;
        
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canShoot = true;
        this.movementSpeed = 0;
    }
    
    setupScene() {
        // Создание неба
        const skyGeometry = new THREE.SphereGeometry(50, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);

        // Создание пола с текстурой
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: this.groundTexture,
            roughness: 0.8,
            color: 0x666666 // Цвет по умолчанию, пока текстура не загрузится
        });
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.scene.add(this.floor);
        
        // Создание ландшафта (темно-зеленые прямоугольники)
        const terrainGeometry = new THREE.PlaneGeometry(20, 20);
        const terrainMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a472a,
            roughness: 0.9
        });
        
        // Первая база
        const base1 = new THREE.Mesh(terrainGeometry, terrainMaterial);
        base1.position.set(-15, 0.1, -15);
        base1.rotation.x = -Math.PI / 2;
        this.scene.add(base1);
        
        // Вторая база
        const base2 = new THREE.Mesh(terrainGeometry, terrainMaterial);
        base2.position.set(15, 0.1, 15);
        base2.rotation.x = -Math.PI / 2;
        this.scene.add(base2);

        // Добавление деревьев
        for (let i = 0; i < 20; i++) {
            // Создаем группу для дерева
            const tree = new THREE.Group();
            
            // Создаем ствол
            const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 2, 8);
            const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2f10 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 1;
            tree.add(trunk);
            
            // Создаем крону (несколько слоев)
            const crownLayers = 3;
            for (let j = 0; j < crownLayers; j++) {
                const crownGeometry = new THREE.ConeGeometry(0.8 - j * 0.2, 1.5, 8);
                const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
                const crown = new THREE.Mesh(crownGeometry, crownMaterial);
                crown.position.y = 2 + j * 0.8;
                tree.add(crown);
            }
            
            // Случайное размещение деревьев
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 15;
            tree.position.x = Math.cos(angle) * distance;
            tree.position.z = Math.sin(angle) * distance;
            
            // Добавляем случайный поворот для разнообразия
            tree.rotation.y = Math.random() * Math.PI;
            
            this.scene.add(tree);
            this.trees = this.trees || [];
            this.trees.push(tree);
        }

        // Добавление камней
        for (let i = 0; i < 15; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(0.5);
            const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            
            // Случайное размещение камней
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 15;
            rock.position.x = Math.cos(angle) * distance;
            rock.position.z = Math.sin(angle) * distance;
            rock.position.y = 0.25;
            
            this.scene.add(rock);
            this.rocks = this.rocks || [];
            this.rocks.push(rock);
        }
    }
    
    setupLights() {
        // Усиленное фоновое освещение для дневного эффекта
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        
        // Основной солнечный свет
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);
        
        // Дополнительный свет для лучшего освещения
        const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.5);
        secondaryLight.position.set(-5, 8, -5);
        this.scene.add(secondaryLight);
    }
    
    setupPlayer() {
        this.camera.position.y = 1.6; // Высота глаз
        this.camera.position.z = 5;
        
        // Создание оружия
        const gunGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
        const gunMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        this.gun = new THREE.Mesh(gunGeometry, gunMaterial);
        
        // Позиционирование оружия относительно камеры
        this.gun.position.set(0.3, -0.2, -0.5);
        this.camera.add(this.gun);
        this.scene.add(this.camera);
    }
    
    setupControls() {
        // Настройка джойстика
        const joystick = document.getElementById('joystick');
        const joystickHead = document.getElementById('joystick-head');
        let isDragging = false;
        let startX, startY;
        
        // Оптимизированная обработка джойстика
        const handleJoystickMove = (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const rect = joystick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = touch.clientX - centerX;
            const deltaY = touch.clientY - centerY;
            
            // Ограничение движения джойстика
            const maxDistance = 35;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const normalizedDistance = Math.min(distance, maxDistance);
            const scale = normalizedDistance / distance || 0;
            
            const moveX = deltaX * scale;
            const moveY = deltaY * scale;
            
            joystickHead.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            // Плавное обновление движения игрока
            const deadzone = 5; // Мертвая зона для предотвращения случайных движений
            this.moveForward = moveY < -deadzone;
            this.moveBackward = moveY > deadzone;
            this.moveLeft = moveX < -deadzone;
            this.moveRight = moveX > deadzone;
            
            // Нормализация скорости движения
            this.movementSpeed = Math.min(Math.max(normalizedDistance / maxDistance, 0), 1);
        };
        
        joystick.addEventListener('touchstart', (e) => {
            isDragging = true;
            handleJoystickMove(e);
        }, { passive: true });
        
        document.addEventListener('touchmove', handleJoystickMove, { passive: true });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
            joystickHead.style.transform = '';
            this.moveForward = this.moveBackward = this.moveLeft = this.moveRight = false;
            this.movementSpeed = 0;
        });
        
        // Кнопка стрельбы с оптимизацией
        const shootBtn = document.getElementById('shoot-btn');
        shootBtn.addEventListener('touchstart', () => this.shoot(), { passive: true });
        
        // Кнопка перезарядки с оптимизацией
        const reloadBtn = document.getElementById('reload-btn');
        reloadBtn.addEventListener('touchstart', () => this.reload(), { passive: true });

        // Оптимизированное управление поворотом головы
        let touchStartX = 0;
        let isRotating = false;
        let lastRotationTime = 0;
        const rotationInterval = 16; // ~60fps

        const handleRotation = (e) => {
            if (!isRotating) return;
            
            const currentTime = performance.now();
            if (currentTime - lastRotationTime < rotationInterval) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            
            // Плавный поворот с ограничением скорости
            const maxRotationSpeed = 0.1;
            const rotationSpeed = Math.min(Math.abs(deltaX) * 0.002, maxRotationSpeed);
            this.camera.rotation.y -= Math.sign(deltaX) * rotationSpeed;
            
            touchStartX = touch.clientX;
            lastRotationTime = currentTime;
        };

        document.addEventListener('touchstart', (e) => {
            const joystickRect = joystick.getBoundingClientRect();
            if (e.touches[0].clientX < joystickRect.left || 
                e.touches[0].clientX > joystickRect.right || 
                e.touches[0].clientY < joystickRect.top || 
                e.touches[0].clientY > joystickRect.bottom) {
                touchStartX = e.touches[0].clientX;
                isRotating = true;
                lastRotationTime = performance.now();
            }
        }, { passive: true });

        document.addEventListener('touchmove', handleRotation, { passive: true });

        document.addEventListener('touchend', () => {
            isRotating = false;
        });
    }
    
    shoot() {
        if (!this.canShoot || this.ammo <= 0) return;
        
        // Воспроизведение звука выстрела
        try {
            if (this.shootSound.readyState >= 2) { // HAVE_CURRENT_DATA или выше
                this.shootSound.currentTime = 0;
                const playPromise = this.shootSound.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error('Ошибка воспроизведения звука:', error);
                    });
                }
            } else {
                console.warn('Звук еще не загружен');
            }
        } catch (error) {
            console.error('Ошибка при работе со звуком:', error);
        }
        
        this.ammo--;
        document.getElementById('ammo-count').textContent = this.ammo;
        
        const bulletGeometry = new THREE.SphereGeometry(0.05);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        
        bullet.position.copy(this.camera.position);
        bullet.rotation.copy(this.camera.rotation);
        
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        bullet.velocity = direction.multiplyScalar(0.7);
        
        this.bullets.push(bullet);
        this.scene.add(bullet);
        
        this.canShoot = false;
        setTimeout(() => this.canShoot = true, 250);
    }
    
    reload() {
        if (this.ammo === GameData.maxAmmo) return;
        
        // Анимация перезарядки
        setTimeout(() => {
            this.ammo = GameData.maxAmmo;
            document.getElementById('ammo-count').textContent = this.ammo;
            // this.playSound('reload');
        }, 1500 * GameData.reloadSpeed);
    }
    
    spawnSCP2947() {
        // Создание SCP-2947
        const scp2947Geometry = new THREE.BoxGeometry(0.6, 1.8, 0.3);
        const scp2947Material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const scp2947 = new THREE.Mesh(scp2947Geometry, scp2947Material);

        // Случайная позиция появления
        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * 10;
        scp2947.position.x = Math.cos(angle) * distance;
        scp2947.position.z = Math.sin(angle) * distance;
        scp2947.position.y = 0.9;

        scp2947.health = 100;
        this.scp2947s.push(scp2947);
        this.scene.add(scp2947);
    }
    
    spawnSCP2947s() {
        setInterval(() => {
            if (this.scp2947s.length < 10 && !this.isGameOver) {
                this.spawnSCP2947();
            }
        }, 3000);
    }
    
    updateSCP2947s() {
        for (let i = this.scp2947s.length - 1; i >= 0; i--) {
            const scp2947 = this.scp2947s[i];
            
            const direction = new THREE.Vector3();
            direction.subVectors(this.camera.position, scp2947.position).normalize();
            scp2947.position.add(direction.multiplyScalar(0.03));
            
            scp2947.lookAt(this.camera.position);
            
            if (scp2947.position.distanceTo(this.camera.position) < 1.5) {
                // Уменьшаем урон от SCP-2947
                this.health -= 0.1;
                document.getElementById('health-count').textContent = Math.ceil(this.health);
                
                if (this.health <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.position.add(bullet.velocity);
            
            for (let j = this.scp2947s.length - 1; j >= 0; j--) {
                const scp2947 = this.scp2947s[j];
                if (bullet.position.distanceTo(scp2947.position) < 1) {
                    this.scene.remove(bullet);
                    this.bullets.splice(i, 1);
                    
                    const damage = 50 * GameData.damageMultiplier * GameData.damageReduction;
                    scp2947.health -= damage;
                    
                    if (scp2947.health <= 0) {
                        this.scene.remove(scp2947);
                        this.scp2947s.splice(j, 1);
                        this.score += 100;
                        this.scp2947sKilled++;
                        this.xp += 100;
                        
                        // Проверяем быстрое убийство
                        const currentTime = performance.now();
                        if (currentTime - this.lastKillTime < 10000) { // 10 секунд
                            this.quickKills++;
                        } else {
                            this.quickKills = 1;
                        }
                        this.lastKillTime = currentTime;
                        
                        // Проверяем убийства без перезарядки
                        if (this.ammo < GameData.maxAmmo) {
                            this.killsWithoutReload++;
                        } else {
                            this.killsWithoutReload = 1;
                        }
                        
                        // Проверяем убийства без получения урона
                        if (this.health === GameData.maxHealth) {
                            this.killsWithoutDamage++;
                        } else {
                            this.killsWithoutDamage = 0;
                        }
                        
                        document.getElementById('score-count').textContent = this.score;
                        
                        // Проверяем повышение уровня
                        if (this.xp >= this.xpToNextLevel) {
                            this.level++;
                            this.xp -= this.xpToNextLevel;
                            this.xpToNextLevel *= 1.5;
                        }
                    }
                    break;
                }
            }
            
            if (bullet.position.length() > 50) {
                this.scene.remove(bullet);
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateMovement() {
        const baseSpeed = 0.05 * GameData.moveSpeed;
        const direction = new THREE.Vector3();
        
        // Сохраняем текущую позицию
        const oldPosition = this.camera.position.clone();
        
        // Получаем направление взгляда камеры
        this.camera.getWorldDirection(direction);
        // Получаем вектор вправо от направления взгляда
        const right = new THREE.Vector3();
        right.crossVectors(direction, new THREE.Vector3(0, 1, 0));
        
        // Применяем скорость движения с учетом нормализации
        const currentSpeed = baseSpeed * (this.movementSpeed || 1);
        
        // Обновляем позицию с учетом направления камеры
        if (this.moveForward) {
            this.camera.position.add(direction.multiplyScalar(currentSpeed));
        }
        if (this.moveBackward) {
            direction.set(0, 0, 0);
            this.camera.getWorldDirection(direction);
            this.camera.position.add(direction.multiplyScalar(-currentSpeed));
        }
        if (this.moveLeft) {
            this.camera.position.add(right.multiplyScalar(-currentSpeed));
        }
        if (this.moveRight) {
            right.set(0, 0, 0);
            right.crossVectors(direction, new THREE.Vector3(0, 1, 0));
            this.camera.position.add(right.multiplyScalar(currentSpeed));
        }

        // Обновляем пройденное расстояние
        const distance = this.camera.position.distanceTo(this.lastPosition);
        this.distanceTraveled += distance;
        this.lastPosition.copy(this.camera.position);
        
        // Проверяем коллизии с деревьями
        if (this.trees) {
            for (const tree of this.trees) {
                const distance = this.camera.position.distanceTo(tree.position);
                if (distance < 1.5) {
                    this.camera.position.copy(oldPosition);
                    break;
                }
            }
        }
        
        // Проверяем коллизии с камнями
        if (this.rocks) {
            for (const rock of this.rocks) {
                const distance = this.camera.position.distanceTo(rock.position);
                if (distance < 1) {
                    this.camera.position.copy(oldPosition);
                    break;
                }
            }
        }
    }
    
    updateMissions() {
        // Обновление прогресса заданий
        if (!GameData.missions[1].completed) {
            GameData.missions[1].killed = this.scp2947sKilled;
            if (this.scp2947sKilled >= 10) {
                this.completeMission(1);
            }
        }

        if (!GameData.missions[2].completed) {
            GameData.missions[2].score = this.score;
            if (this.score >= 1000) {
                this.completeMission(2);
            }
        }

        if (!GameData.missions[3].completed) {
            GameData.missions[3].time = this.gameTime;
            if (this.gameTime >= 300) { // 5 минут
                this.completeMission(3);
            }
        }

        if (!GameData.missions[4].completed) {
            GameData.missions[4].killed = this.scp2947sKilled;
            if (this.scp2947sKilled >= 50) {
                this.completeMission(4);
            }
        }

        if (!GameData.missions[5].completed) {
            GameData.missions[5].killed = this.scp2947sKilled;
            if (this.scp2947sKilled >= 100) {
                this.completeMission(5);
            }
        }

        if (!GameData.missions[6].completed) {
            GameData.missions[6].score = this.score;
            if (this.score >= 5000) {
                this.completeMission(6);
            }
        }

        if (!GameData.missions[7].completed) {
            GameData.missions[7].time = this.gameTime;
            if (this.gameTime >= 600) { // 10 минут
                this.completeMission(7);
            }
        }

        if (!GameData.missions[8].completed) {
            GameData.missions[8].noReloadKills = this.killsWithoutReload;
            if (this.killsWithoutReload >= 10) {
                this.completeMission(8);
            }
        }

        if (!GameData.missions[9].completed) {
            GameData.missions[9].quickKills = this.quickKills;
            if (this.quickKills >= 5) {
                this.completeMission(9);
            }
        }

        if (!GameData.missions[10].completed) {
            GameData.missions[10].distance = this.distanceTraveled;
            if (this.distanceTraveled >= 1000) {
                this.completeMission(10);
            }
        }

        if (!GameData.missions[11].completed) {
            GameData.missions[11].noDamageKills = this.killsWithoutDamage;
            if (this.killsWithoutDamage >= 20) {
                this.completeMission(11);
            }
        }

        if (!GameData.missions[12].completed) {
            GameData.missions[12].score = this.score;
            if (this.score >= 10000) {
                this.completeMission(12);
            }
        }

        if (!GameData.missions[13].completed) {
            GameData.missions[13].time = this.gameTime;
            if (this.gameTime >= 900) { // 15 минут
                this.completeMission(13);
            }
        }

        if (!GameData.missions[14].completed) {
            GameData.missions[14].killed = this.scp2947sKilled;
            if (this.scp2947sKilled >= 200) {
                this.completeMission(14);
            }
        }

        if (!GameData.missions[15].completed) {
            GameData.missions[15].level = this.level;
            if (this.level >= 20) {
                this.completeMission(15);
            }
        }

        if (!GameData.missions[16].completed) {
            const boughtItems = Object.values(GameData.boughtItems || {}).filter(bought => bought).length;
            GameData.missions[16].shopItems = boughtItems;
            if (boughtItems >= 7) {
                this.completeMission(16);
            }
        }

        if (!GameData.missions[17].completed) {
            GameData.missions[17].killed = this.scp2947sKilled;
            if (this.scp2947sKilled >= 500) {
                this.completeMission(17);
            }
        }

        if (!GameData.missions[18].completed) {
            GameData.missions[18].time = this.gameTime;
            if (this.gameTime >= 1800) { // 30 минут
                this.completeMission(18);
            }
        }

        if (!GameData.missions[19].completed) {
            GameData.missions[19].score = this.score;
            if (this.score >= 50000) {
                this.completeMission(19);
            }
        }

        // Проверка задания "Стать легендой"
        if (!GameData.missions[20].completed) {
            const completedMissions = Object.entries(GameData.missions)
                .filter(([id, mission]) => id !== '20' && mission.completed).length;
            if (completedMissions >= 19) {
                this.completeMission(20);
            }
        }
    }
    
    animate() {
        if (this.isGameOver) return;
        
        requestAnimationFrame(() => this.animate());
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.gameTime += deltaTime;
        
        // Регенерация здоровья
        if (GameData.healthRegen > 0 && this.health < GameData.maxHealth) {
            this.health = Math.min(this.health + GameData.healthRegen * deltaTime, GameData.maxHealth);
            document.getElementById('health-count').textContent = Math.ceil(this.health);
        }
        
        this.updateMovement();
        this.updateSCP2947s();
        this.updateBullets();
        this.updateMissions();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    gameOver() {
        this.isGameOver = true;
        
        // Добавляем очки в общий баланс
        GameData.totalScore += this.score;
        GameData.save(); // Асинхронное сохранение
        
        document.getElementById('game-over').classList.add('active');
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('completed-missions').textContent = 
            Object.values(GameData.missions).filter(m => m.completed).length;
    }
}

// Инициализация игры
window.addEventListener('load', async () => {
    await GameData.load();
    
    const menu = document.getElementById('menu');
    const missions = document.getElementById('missions');
    const shop = document.getElementById('shop');
    
    menu.classList.add('active');
    
    // Обработчики кнопок меню
    document.getElementById('start-btn').addEventListener('click', () => {
        menu.classList.remove('active');
        new ZombieShooter(); // Создание игры теперь автоматически вызовет mounted()
    });
    
    document.getElementById('missions-btn').addEventListener('click', () => {
        menu.classList.remove('active');
        missions.classList.add('active');
        updateMissionsUI();
    });
    
    document.getElementById('shop-btn').addEventListener('click', () => {
        menu.classList.remove('active');
        shop.classList.add('active');
        updateShopUI();
    });
    
    document.getElementById('missions-back').addEventListener('click', () => {
        missions.classList.remove('active');
        menu.classList.add('active');
    });
    
    document.getElementById('shop-back').addEventListener('click', () => {
        shop.classList.remove('active');
        menu.classList.add('active');
    });
    
    document.getElementById('menu-btn').addEventListener('click', () => {
        document.getElementById('game-over').classList.remove('active');
        menu.classList.add('active');
    });
    
    // Обработчики покупок в магазине
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.closest('.shop-item').dataset.id;
            buyItem(itemId);
        });
    });
});

function completeSocialMission(missionId, reward) {
    if (!GameData.missions[missionId].completed) {
        GameData.missions[missionId].completed = true;
        GameData.totalScore += reward;
        GameData.save(); // Асинхронное сохранение
        GameData.updateUI();
        
        const btn = document.querySelector(`.mission[data-id="${missionId}"] .social-claim`);
        btn.disabled = true;
        btn.textContent = 'Получено';
        
        alert(`Поздравляем! Вы получили ${reward} очков!`);
    }
}

function updateMissionsUI() {
    Object.entries(GameData.missions).forEach(([id, mission]) => {
        const missionElement = document.querySelector(`.mission[data-id="${id}"]`);
        if (missionElement) {
            const claimBtn = missionElement.querySelector('.claim-btn');
            const progressElement = missionElement.querySelector('.progress');
            
            if (!mission.completed) {
                switch (id) {
                    case '1':
                        progressElement.textContent = `${mission.killed}/10`;
                        break;
                    case '2':
                        progressElement.textContent = `${mission.score}/1000`;
                        break;
                    case '3':
                        const minutes3 = Math.floor(mission.time / 60);
                        const seconds3 = Math.floor(mission.time % 60);
                        progressElement.textContent = 
                            `${minutes3}:${seconds3.toString().padStart(2, '0')}/5:00`;
                        break;
                    case '4':
                        progressElement.textContent = `${mission.killed}/50`;
                        break;
                    case '5':
                        progressElement.textContent = `${mission.killed}/100`;
                        break;
                    case '6':
                        progressElement.textContent = `${mission.score}/5000`;
                        break;
                    case '7':
                        const minutes7 = Math.floor(mission.time / 60);
                        const seconds7 = Math.floor(mission.time % 60);
                        progressElement.textContent = 
                            `${minutes7}:${seconds7.toString().padStart(2, '0')}/10:00`;
                        break;
                    case '8':
                        progressElement.textContent = `${mission.noReloadKills}/10`;
                        break;
                    case '9':
                        progressElement.textContent = `${mission.quickKills}/5`;
                        break;
                    case '10':
                        progressElement.textContent = `${Math.floor(mission.distance)}/1000м`;
                        break;
                    case '11':
                        progressElement.textContent = `${mission.noDamageKills}/20`;
                        break;
                    case '12':
                        progressElement.textContent = `${mission.score}/10000`;
                        break;
                    case '13':
                        const minutes13 = Math.floor(mission.time / 60);
                        const seconds13 = Math.floor(mission.time % 60);
                        progressElement.textContent = 
                            `${minutes13}:${seconds13.toString().padStart(2, '0')}/15:00`;
                        break;
                    case '14':
                        progressElement.textContent = `${mission.killed}/200`;
                        break;
                    case '15':
                        progressElement.textContent = `${mission.level}/20`;
                        break;
                    case '16':
                        progressElement.textContent = `${mission.shopItems}/7`;
                        break;
                    case '17':
                        progressElement.textContent = `${mission.killed}/500`;
                        break;
                    case '18':
                        const minutes18 = Math.floor(mission.time / 60);
                        const seconds18 = Math.floor(mission.time % 60);
                        progressElement.textContent = 
                            `${minutes18}:${seconds18.toString().padStart(2, '0')}/30:00`;
                        break;
                    case '19':
                        progressElement.textContent = `${mission.score}/50000`;
                        break;
                    case '20':
                        const completedMissions = Object.entries(GameData.missions)
                            .filter(([mid, m]) => mid !== '20' && m.completed).length;
                        progressElement.textContent = `${completedMissions}/19`;
                        break;
                }
            } else {
                progressElement.textContent = 'Выполнено';
            }
            
            if (mission.completed) {
                claimBtn.disabled = true;
                claimBtn.textContent = 'Получено';
            }
        }
    });
}

function updateShopUI() {
    document.querySelectorAll('.shop-item').forEach(item => {
        const buyBtn = item.querySelector('.buy-btn');
        const itemId = item.dataset.id;
        const prices = {
            1: 1000,
            2: 2000,
            3: 3000,
            4: 2500,
            5: 5000,
            6: 4000,
            7: 6000
        };
        const price = prices[itemId];
        
        if (GameData.boughtItems[itemId]) {
            buyBtn.disabled = true;
            buyBtn.textContent = 'Куплено';
        } else {
            buyBtn.disabled = GameData.totalScore < price;
            buyBtn.textContent = 'Купить';
        }
    });
}

function buyItem(itemId) {
    const prices = {
        1: 1000,
        2: 2000,
        3: 3000,
        4: 2500,
        5: 5000,
        6: 4000,
        7: 6000
    };
    
    const price = prices[itemId];
    if (GameData.totalScore >= price && !GameData.boughtItems[itemId]) {
        GameData.totalScore -= price;
        GameData.boughtItems[itemId] = true;
        
        switch (itemId) {
            case '1':
                GameData.maxHealth += 20;
                break;
            case '2':
                GameData.damageMultiplier *= 1.25;
                break;
            case '3':
                GameData.maxAmmo = 60;
                break;
            case '4':
                GameData.reloadSpeed = 0.5;
                break;
            case '5':
                GameData.healthRegen = 1;
                break;
            case '6':
                GameData.moveSpeed = 1.3;
                break;
            case '7':
                GameData.damageReduction = 0.7;
                break;
        }
        
        GameData.save();
        GameData.updateUI();
        updateShopUI();
        
        // Проверяем выполнение задания на открытие всех улучшений
        const boughtItems = Object.values(GameData.boughtItems).filter(bought => bought).length;
        if (boughtItems === 7 && !GameData.missions[16].completed) {
            completeMission(16);
        }
    }
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    const game = document.querySelector('canvas').parentNode.__vue__;
    if (!game) return;
    
    game.camera.aspect = window.innerWidth / window.innerHeight;
    game.camera.updateProjectionMatrix();
    game.renderer.setSize(window.innerWidth, window.innerHeight);
}); 