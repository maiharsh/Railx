const { spawn } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚂 RailX Development Server');
console.log('==========================\n');

async function setupEnvironment() {
    console.log('🔧 Setting up environment...\n');

    console.log('📦 Installing frontend dependencies...');
    try {
        await runCommand('npm', ['install'], { cwd: path.join(__dirname, '..') });
        console.log('✅ Frontend dependencies installed\n');
    } catch (error) {
        console.error('❌ Error installing frontend dependencies:', error.message);
        process.exit(1);
    }

    console.log('📦 Installing backend dependencies...');
    try {
        await runCommand('npm', ['install'], { cwd: path.join(__dirname, '..', 'backend') });
        console.log('✅ Backend dependencies installed\n');
    } catch (error) {
        console.error('❌ Error installing backend dependencies:', error.message);
        process.exit(1);
    }

    console.log('⚙️  Setting up backend environment...');
    const envPath = path.join(__dirname, '..', 'backend', '.env');
    const envContent = `DB_HOST="mongodb://localhost:27017"
        DB_NAME="railway_booking"
        JWT_SECRET="VXmwynsoB1eUG6lBp4wcJjTTpn2XdqSfehHUMx2kAh8="
        PORT=5001
        NODE_ENV="development"
    `;

    try {
        if (fs.existsSync(envPath)) {
            fs.unlinkSync(envPath);
            console.log('🗑️  Removed existing .env file');
        }

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Created new .env file\n');
    } catch (error) {
        console.error('❌ Error setting up .env file:', error.message);
        process.exit(1);
    }
}

async function main() {
    try {
        await setupEnvironment();

        rl.question('Do you want to seed the database with initial data? (y/N): ', async (answer) => {
            const shouldSeed = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';

            if (shouldSeed) {
                console.log('🌱 Seeding database...');
                try {
                    await runCommand('npm', ['run', 'seed'], { cwd: path.join(__dirname, '..', 'backend') });
                    console.log('✅ Database seeded successfully!\n');
                } catch (error) {
                    console.error('❌ Error seeding database:', error.message);
                    console.log('Continuing with server startup...\n');
                }
            } else {
                console.log('Skipping database seeding.\n');
            }

            rl.close();

            console.log('🚀 Starting development servers...\n');

            const concurrently = spawn('npx', ['concurrently', '--names', 'frontend,backend', '--prefix', 'name', '--prefix-colors', 'cyan,magenta',
                '"npm run dev"',
                '"cd backend && npm run dev"'
            ], {
                cwd: path.join(__dirname, '..'),
                stdio: 'inherit',
                shell: true
            });

            concurrently.on('close', (code) => {
                console.log(`\nDevelopment servers stopped with code ${code}`);
                process.exit(code);
            });

            process.on('SIGINT', () => {
                console.log('\n🛑 Stopping development servers...');
                concurrently.kill('SIGINT');
            });
        });
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

main();

function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { ...options, stdio: 'inherit' });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
}