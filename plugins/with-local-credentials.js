const { withAppBuildGradle, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo Config Plugin to automatically copy local credentials (keystore, google-services)
 * and configure signing in build.gradle during prebuild.
 */
function withLocalCredentials(config) {
    // 1. Copy files (DangerousMod allows file system operations in the android/ios folders)
    config = withDangerousMod(config, [
        'android',
        async (config) => {
            const projectRoot = config.modRequest.projectRoot;
            const androidAppDir = path.join(projectRoot, 'android', 'app');

            // Ensure android/app exists
            if (!fs.existsSync(androidAppDir)) return config;

            // Copy Keystore
            const srcKeystore = path.join(projectRoot, 'credentials', 'android', 'keystore.jks');
            const destKeystore = path.join(androidAppDir, 'keystore.jks');
            if (fs.existsSync(srcKeystore)) {
                fs.copyFileSync(srcKeystore, destKeystore);
                console.log('✅ Copied keystore.jks to android/app/');
            }

            // Copy google-services.json if it exists in root
            const srcGoogleServices = path.join(projectRoot, 'google-services.json');
            const destGoogleServices = path.join(androidAppDir, 'google-services.json');
            if (fs.existsSync(srcGoogleServices)) {
                fs.copyFileSync(srcGoogleServices, destGoogleServices);
                console.log('✅ Copied google-services.json to android/app/');
            }

            return config;
        },
    ]);

    // 2. Modify build.gradle to use the credentials from credentials.json
    config = withAppBuildGradle(config, (config) => {
        const projectRoot = config.modRequest.projectRoot;
        const credsFile = path.join(projectRoot, 'credentials.json');

        if (fs.existsSync(credsFile)) {
            try {
                const creds = JSON.parse(fs.readFileSync(credsFile, 'utf8'));
                const androidCreds = creds.android?.keystore;

                if (androidCreds) {
                    config.modResults.contents = applySigningConfig(
                        config.modResults.contents,
                        androidCreds
                    );
                    console.log('✅ Applied signing configuration to build.gradle');
                }
            } catch (e) {
                console.error('❌ Failed to apply signing config:', e.message);
            }
        }

        return config;
    });

    return config;
}

function applySigningConfig(content, creds) {
    // Replace the debug signing config or add it
    // We'll target the signingConfigs block
    const signingConfigReplacement = `
    signingConfigs {
        debug {
            storeFile file('keystore.jks')
            storePassword '${creds.keystorePassword}'
            keyAlias '${creds.keyAlias}'
            keyPassword '${creds.keyPassword}'
        }
        release {
            storeFile file('keystore.jks')
            storePassword '${creds.keystorePassword}'
            keyAlias '${creds.keyAlias}'
            keyPassword '${creds.keyPassword}'
        }
    }`;

    // Use regex to replace the existing signingConfigs block
    // We match more specifically to avoid stopping at the first nested brace
    const newContent = content.replace(/signingConfigs\s*{[\s\S]*?debug\s*{[\s\S]*?}\s*}/, signingConfigReplacement);

    // Also ensure buildTypes use the correct signing config
    return newContent.replace(/signingConfig signingConfigs\.debug/g, (match, offset, fullText) => {
        // Find if we are inside 'release' block
        const prevText = fullText.substring(0, offset);
        if (prevText.lastIndexOf('release {') > prevText.lastIndexOf('}')) {
            return 'signingConfig signingConfigs.release';
        }
        return match;
    });
}

module.exports = withLocalCredentials;
