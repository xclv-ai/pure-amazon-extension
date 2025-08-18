// BrandAnalysisCards.js - STATIC UI ONLY - NO FUNCTIONALITY
// Just showing your beautiful design exactly as it should look

document.addEventListener('DOMContentLoaded', () => {
    console.log('BrandAnalysisCards: DOM loaded, creating static UI...');
    
    // Just populate the static content immediately
    createStaticToneAnalysis();
    createStaticArchetypes(); 
    createStaticVisualIdentity();
    createStaticInsights();
});

function createStaticToneAnalysis() {
    const container = document.getElementById('tone-dimensions');
    if (!container) return;

    container.innerHTML = `
        <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 16px; font-weight: 500; color: var(--brand-text-primary);">Formality</span>
                <span style="font-size: 12px; color: var(--brand-text-primary); font-family: 'JetBrains Mono', monospace; background: var(--brand-bg-muted); padding: 4px 8px; border-radius: 12px; border: 1px solid var(--brand-border-light);">64%</span>
            </div>
            <div style="font-size: 14px; color: var(--brand-text-secondary); margin-bottom: 8px;">Slightly Formal</div>
            <div style="position: relative; width: 100%; height: 8px; background: var(--brand-bg-muted); border-radius: 4px; margin-bottom: 8px;">
                <div style="position: absolute; height: 100%; background: var(--brand-accent-teal); border-radius: 4px; width: 64%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--brand-text-tertiary);">
                <span>Casual</span><span>Formal</span>
            </div>
        </div>

        <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 16px; font-weight: 500; color: var(--brand-text-primary);">Humor</span>
                <span style="font-size: 12px; color: var(--brand-text-primary); font-family: 'JetBrains Mono', monospace; background: var(--brand-bg-muted); padding: 4px 8px; border-radius: 12px; border: 1px solid var(--brand-border-light);">50%</span>
            </div>
            <div style="font-size: 14px; color: var(--brand-text-secondary); margin-bottom: 8px;">Serious</div>
            <div style="position: relative; width: 100%; height: 8px; background: var(--brand-bg-muted); border-radius: 4px; margin-bottom: 8px;">
                <div style="position: absolute; height: 100%; background: var(--brand-accent-teal); border-radius: 4px; width: 50%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--brand-text-tertiary);">
                <span>Serious</span><span>Playful</span>
            </div>
        </div>

        <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 16px; font-weight: 500; color: var(--brand-text-primary);">Respect</span>
                <span style="font-size: 12px; color: var(--brand-text-primary); font-family: 'JetBrains Mono', monospace; background: var(--brand-bg-muted); padding: 4px 8px; border-radius: 12px; border: 1px solid var(--brand-border-light);">50%</span>
            </div>
            <div style="font-size: 14px; color: var(--brand-text-secondary); margin-bottom: 8px;">Respectful</div>
            <div style="position: relative; width: 100%; height: 8px; background: var(--brand-bg-muted); border-radius: 4px; margin-bottom: 8px;">
                <div style="position: absolute; height: 100%; background: var(--brand-accent-teal); border-radius: 4px; width: 50%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--brand-text-tertiary);">
                <span>Irreverent</span><span>Respectful</span>
            </div>
        </div>

        <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 16px; font-weight: 500; color: var(--brand-text-primary);">Enthusiasm</span>
                <span style="font-size: 12px; color: var(--brand-text-primary); font-family: 'JetBrains Mono', monospace; background: var(--brand-bg-muted); padding: 4px 8px; border-radius: 12px; border: 1px solid var(--brand-border-light);">50%</span>
            </div>
            <div style="font-size: 14px; color: var(--brand-text-secondary); margin-bottom: 8px;">Matter-of-fact</div>
            <div style="position: relative; width: 100%; height: 8px; background: var(--brand-bg-muted); border-radius: 4px; margin-bottom: 8px;">
                <div style="position: absolute; height: 100%; background: var(--brand-accent-teal); border-radius: 4px; width: 50%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--brand-text-tertiary);">
                <span>Matter-of-fact</span><span>Enthusiastic</span>
            </div>
        </div>
    `;
}

function createStaticArchetypes() {
    const container = document.getElementById('archetypes-content');
    if (!container) return;

    container.innerHTML = `
        <div style="font-size: 12px; color: var(--brand-text-secondary); font-family: 'JetBrains Mono', monospace; margin-bottom: 16px;">
            // ARCHETYPE_SPECTRUM_ANALYSIS
        </div>
        
        <div style="position: relative; height: 48px; background: var(--brand-border-light); border-radius: 24px; overflow: hidden; margin-bottom: 24px;">
            <div style="position: absolute; top: 0; height: 100%; background: var(--brand-accent-yellow); left: 0%; width: 70%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 14px; font-weight: bold; color: var(--brand-text-primary);">70%</span>
            </div>
            <div style="position: absolute; top: 0; height: 100%; background: var(--brand-accent-rose); left: 70%; width: 15%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 14px; font-weight: bold; color: var(--brand-text-primary);">15%</span>
            </div>
            <div style="position: absolute; top: 0; height: 100%; background: var(--brand-text-secondary); left: 85%; width: 15%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 14px; font-weight: bold; color: white;">15%</span>
            </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px;">
                <div style="width: 32px; height: 32px; background: var(--brand-accent-yellow); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--brand-text-primary);">70</div>
                <div style="flex: 1;">
                    <div style="font-size: 14px; font-weight: 500; color: var(--brand-text-primary);">The Innocent</div>
                    <div style="font-size: 12px; color: var(--brand-text-secondary);">Seeking happiness and simplicity</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px;">
                <div style="width: 32px; height: 32px; background: var(--brand-accent-rose); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--brand-text-primary);">15</div>
                <div style="flex: 1;">
                    <div style="font-size: 14px; font-weight: 500; color: var(--brand-text-primary);">The Caregiver</div>
                    <div style="font-size: 12px; color: var(--brand-text-secondary);">Compassion and service to others</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px;">
                <div style="width: 32px; height: 32px; background: var(--brand-text-secondary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">15</div>
                <div style="flex: 1;">
                    <div style="font-size: 14px; font-weight: 500; color: var(--brand-text-primary);">The Sage</div>
                    <div style="font-size: 12px; color: var(--brand-text-secondary);">Driven by knowledge and truth</div>
                </div>
            </div>
        </div>
    `;
}

function createStaticVisualIdentity() {
    const container = document.getElementById('visual-content');
    if (!container) return;

    container.innerHTML = `
        <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 8px 0;">
                <span style="font-size: 16px; font-weight: 400; color: var(--brand-text-primary);">
                    <span style="font-family: 'JetBrains Mono', monospace; font-weight: 300;">[ ]</span> LOOK & FEEL
                </span>
                <span style="font-size: 12px; color: var(--brand-text-secondary); opacity: 0;">details</span>
            </div>
        </div>

        <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 8px 0;">
                <span style="font-size: 16px; font-weight: 400; color: var(--brand-text-primary);">
                    <span style="font-family: 'JetBrains Mono', monospace; font-weight: 300;">[*]</span> PRIMARY PALETTE
                </span>
                <span style="font-size: 12px; color: var(--brand-text-secondary); opacity: 1; background: var(--brand-accent-yellow); padding: 4px 8px; border-radius: 4px;">hide</span>
            </div>
            <div style="background: var(--brand-bg-muted); padding: 12px; border-radius: 4px; margin-top: 8px;">
                <div style="font-size: 12px; color: var(--brand-text-secondary); font-family: 'JetBrains Mono', monospace; margin-bottom: 12px;">
                    // PRIMARY_PALETTE
                </div>
                <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <div style="width: 32px; height: 32px; background: #F6F951; border-radius: 50%; border: 2px solid var(--brand-border-light);"></div>
                        <span style="font-size: 10px; color: var(--brand-text-secondary);">#F6F951</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <div style="width: 32px; height: 32px; background: #FFD700; border-radius: 50%; border: 2px solid var(--brand-border-light);"></div>
                        <span style="font-size: 10px; color: var(--brand-text-secondary);">#FFD700</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <div style="width: 32px; height: 32px; background: #F5DEB3; border-radius: 50%; border: 2px solid var(--brand-border-light);"></div>
                        <span style="font-size: 10px; color: var(--brand-text-secondary);">#F5DEB3</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <div style="width: 32px; height: 32px; background: #D2B48C; border-radius: 50%; border: 2px solid var(--brand-border-light);"></div>
                        <span style="font-size: 10px; color: var(--brand-text-secondary);">#D2B48C</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <div style="width: 32px; height: 32px; background: #8B4513; border-radius: 50%; border: 2px solid var(--brand-border-light);"></div>
                        <span style="font-size: 10px; color: var(--brand-text-secondary);">#8B4513</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <div style="width: 32px; height: 32px; background: #f1c7d6; border-radius: 50%; border: 2px solid var(--brand-border-light);"></div>
                        <span style="font-size: 10px; color: var(--brand-text-secondary);">#f1c7d6</span>
                    </div>
                </div>
                <p style="font-size: 14px; color: var(--brand-text-primary); line-height: 1.6;">
                    Predominantly warm yellows, beige, gold, and brown tones, often with pink accents for promotional text or specific claims.
                </p>
            </div>
        </div>

        <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 8px 0;">
                <span style="font-size: 16px; font-weight: 400; color: var(--brand-text-primary);">
                    <span style="font-family: 'JetBrains Mono', monospace; font-weight: 300;">[ ]</span> DISTINCTIVE ASSETS
                </span>
                <span style="font-size: 12px; color: var(--brand-text-secondary); opacity: 0;">details</span>
            </div>
        </div>
    `;
}

function createStaticInsights() {
    const container = document.getElementById('insights-content');
    if (!container) return;

    container.innerHTML = `
        <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 8px 0;">
                <span style="font-size: 16px; font-weight: 400; color: var(--brand-text-primary);">
                    <span style="font-family: 'JetBrains Mono', monospace; font-weight: 300;">[ ]</span> OVERALL PERCEPTION
                </span>
                <span style="font-size: 12px; color: var(--brand-text-secondary); opacity: 0;">details</span>
            </div>
        </div>

        <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 8px 0;">
                <span style="font-size: 16px; font-weight: 400; color: var(--brand-text-primary);">
                    <span style="font-family: 'JetBrains Mono', monospace; font-weight: 300;">[ ]</span> COMMUNICATION FOCUS
                </span>
                <span style="font-size: 12px; color: var(--brand-text-secondary); opacity: 0;">details</span>
            </div>
        </div>
    `;
}