const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

// Replace standard alerts
code = code.replace(/alert\("Вы не отдали ни одного голоса!"\);/g, 'customAlert("Вы не отдали ни одного голоса!");');
code = code.replace(/alert\("Вы были ДЕПОРТИРОВАНЫ из USS за поддержку чужой идеологии\."\);/g, 'customAlert("Вы были ДЕПОРТИРОВАНЫ из USS за поддержку чужой идеологии.", () => { window.location.reload(); });');
code = code.replace(/alert\("Голоса успешно сохранены!"\);/g, 'customAlert("Голоса успешно сохранены!", () => { window.location.reload(); });');
code = code.replace(/alert\((res\.error \|\| "Ошибка сохранения")\);/g, 'customAlert($1);');

// The reload is now inside the callback, so remove the duplicate window.location.reload()
code = code.replace(/window\.location\.reload\(\);\s*\}\s*else\s*\{/g, '} else {');

// Fix the closing bracket of customConfirm
// The code is:
/*
                    }).then(res => {
                        if (res.success) {
                            modal.remove();
                            if (res.deported) {
                                customAlert("Вы были ДЕПОРТИРОВАНЫ из USS за поддержку чужой идеологии.", () => { window.location.reload(); });
                            } else {
                                customAlert("Голоса успешно сохранены!", () => { window.location.reload(); });
                            }
                            
                        } else {
                            customAlert(res.error || "Ошибка сохранения");
                            submitBtn.textContent = "Завершить голосование";
                            submitBtn.disabled = false;
                        }
                    });
                }
            });
*/
// The '}' on the line after '});' is the end of the confirm block.
code = code.replace(/\}\);\s*\}\s*\}\);\s*\}\s*\}\s*attachEvents\(\);\s*\}/, '});\n                });\n            });\n        }\n    }\n    \n    attachEvents();\n}');

fs.writeFileSync('uss-civil-war.js', code);
