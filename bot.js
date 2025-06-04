const chalk = require('chalk');
const axios = require('axios');
const { ethers } = require('ethers');
const readline = require('readline');


console.clear();

console.log(chalk.hex('#FFA500').bold(`
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║  ${chalk.hex('#00FFFF')('█████╗ ██╗   ██╗████████╗ ██████╗')}                       ${chalk.hex('#FF00FF')('★')} ${chalk.hex('#FFFF00')('★')} ${chalk.hex('#00FF00')('★')}  ║
║  ${chalk.hex('#00FFFF')('██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗')}                     ${chalk.hex('#FF00FF')('★')} ${chalk.hex('#FFFF00')('★')} ${chalk.hex('#00FF00')('★')}  ║
║  ${chalk.hex('#00FFFF')('███████║██║   ██║   ██║   ██║   ██║')}                     ${chalk.hex('#FF00FF')('★')} ${chalk.hex('#FFFF00')('★')} ${chalk.hex('#00FF00')('★')}  ║
║  ${chalk.hex('#00FFFF')('██╔══██║██║   ██║   ██║   ██║   ██║')}                     ${chalk.hex('#FF00FF')('★')} ${chalk.hex('#FFFF00')('★')} ${chalk.hex('#00FF00')('★')}  ║
║  ${chalk.hex('#00FFFF')('██║  ██║╚██████╔╝   ██║   ╚██████╔╝')}                     ${chalk.hex('#FF00FF')('★')} ${chalk.hex('#FFFF00')('★')} ${chalk.hex('#00FF00')('★')}  ║
║  ${chalk.hex('#00FFFF')('╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝')}                      ${chalk.hex('#FF00FF')('★')} ${chalk.hex('#FFFF00')('★')} ${chalk.hex('#00FF00')('★')}  ║
║                                                                            ║
║  ${chalk.hex('#FF0000').bold('ＢＯＴ')} ${chalk.hex('#FFFF00').bold('ＡＵＴＯ')} ${chalk.hex('#00FF00').bold('ＲＥＧＩＳＴＥＲ')} ${chalk.hex('#00FFFF').bold('ＦＬＵＥＮＣＥ')}  ║
║                                                                            ║
║  ${chalk.hex('#FF69B4')('✿')} ${chalk.cyan('Telegram: https://t.me/airdropdiggerid')} ${chalk.hex('#FF69B4')('✿')}  ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
`));

console.log(chalk.hex('#FF69B4').bold('✧･ﾟ: *✧･ﾟ:* ' + chalk.hex('#00FFFF').underline('WELCOME TO AUTO REGISTER BOT') + ' *:･ﾟ✧*:･ﾟ✧'));
console.log(chalk.hex('#FFA500').bold('✧･ﾟ: *✧･ﾟ:* ' + chalk.hex('#00FF00').underline('PLEASE ENTER THE NUMBER OF ACCOUNTS TO REGISTER') + ' *:･ﾟ✧*:･ﾟ✧'));

// Konfigurasi Referral Code
const REFERRAL_CODE = 'YOUR_REFFERAL_CODE'; // kode reff ganti reffmu cok jangan lupa star
const BASE_URL = 'https://pointless-api.fluence.network/api/v1';
const TASKS_TO_COMPLETE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // ID task yang perlu diselesaikan

// Fungsi untuk generate auto wallet baru
function generateWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

async function signMessage(privateKey, message) {
    const wallet = new ethers.Wallet(privateKey);
    const signature = await wallet.signMessage(message);
    return signature;
}

// Fungsi utama
async function autoRegister(count) {
    for (let i = 0; i < count; i++) {
        try {
            console.log(chalk.hex('#FF69B4').bold(`\n✨ Processing account ${i + 1}/${count} ✨`));
            
            // Generate wallet baru
            const wallet = generateWallet();
            console.log(chalk.hex('#00FFFF')(`🔑 Generated wallet: ${wallet.address}`));
            console.log(chalk.hex('#FFA500')(`🔒 Private Key: ${wallet.privateKey}`));

            // 1. Check referral code
            console.log(chalk.hex('#FFFF00')('🔍 Checking referral code...'));
            const referralCheck = await axios.get(`${BASE_URL}/referrals/code/${REFERRAL_CODE}/boost`);
            console.log(chalk.hex('#00FF00')(`🎯 Referral boost: ${referralCheck.data.data.boostPercentage}%`));

            // 2. Check if wallet exists
            console.log(chalk.hex('#FFFF00')('🔍 Checking wallet existence...'));
            const existsRes = await axios.post(`${BASE_URL}/auth/exists`, {
                walletAddress: wallet.address
            });
            if (existsRes.data.data.exists) {
                console.log(chalk.hex('#FF0000')('⚠️ Wallet already registered, skipping...'));
                continue;
            }

            // 3. Get nonce
            console.log(chalk.hex('#FFFF00')('🔢 Getting nonce...'));
            const nonceRes = await axios.post(`${BASE_URL}/auth/nonce`, {
                walletAddress: wallet.address
            });
            const nonce = nonceRes.data.data.nonce;
            console.log(chalk.hex('#00FFFF')(`🔢 Nonce: ${nonce}`));

            // 4. Sign nonce
            console.log(chalk.hex('#FFFF00')('✍️ Signing nonce...'));
            const signature = await signMessage(wallet.privateKey, nonce);

            // 5. Verify signature
            console.log(chalk.hex('#FFFF00')('✅ Verifying signature...'));
            const verifyRes = await axios.post(`${BASE_URL}/auth/verify`, {
                walletAddress: wallet.address,
                signature: signature
            });
            const accessToken = verifyRes.data.data.accessToken;
            console.log(chalk.hex('#00FF00').bold('🔓 Login successful!'));

            // 6. Check auth status
            console.log(chalk.hex('#FFFF00')('🔐 Checking auth status...'));
            const authCheck = await axios.get(`${BASE_URL}/auth/check`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(chalk.hex('#00FFFF')(`👤 User ID: ${authCheck.data.data.userId}`));

            // 7. Apply referral code
            console.log(chalk.hex('#FFFF00')('📝 Applying referral code...'));
            const applyRef = await axios.post(`${BASE_URL}/referrals/apply`, {
                referralCode: REFERRAL_CODE
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(chalk.hex('#00FF00')(applyRef.data.data.message));

            // 8. Complete tasks
            for (const taskId of TASKS_TO_COMPLETE) {
                console.log(chalk.hex('#FFFF00')(`🏆 Completing task ${taskId}...`));
                try {
                    const taskRes = await axios.post(`${BASE_URL}/verify`, {
                        activityId: taskId
                    }, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    console.log(chalk.hex('#00FF00').bold(`🎉 Task ${taskId} completed! Points awarded: ${taskRes.data.data.pointsAwarded}`));
                } catch (taskError) {
                    console.error(chalk.hex('#FF0000')(`❌ Error completing task ${taskId}:`, taskError.response?.data || taskError.message));
                }
            }

            console.log(chalk.hex('#00FF00').bold(`✔️ Account ${i + 1} completed successfully!`));
            console.log(chalk.hex('#FF69B4')('══════════════════════════════════════════════════'));
        } catch (error) {
            console.error(chalk.hex('#FF0000')(`❌ Error: ${error.response?.data || error.message}`));
            console.log(chalk.hex('#FFA500')('⏩ Skipping to next account...'));
        }
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(chalk.hex('#00FFFF').bold('👉 Masukkan jumlah akun yang ingin diregister: '), (answer) => {
    const count = parseInt(answer);
    if (isNaN(count) || count <= 0) {
        console.log(chalk.hex('#FF0000')('❌ Input tidak valid. masukan no yang benar'));
        rl.close();
        return;
    }
    
    rl.close();
    autoRegister(count);
});
