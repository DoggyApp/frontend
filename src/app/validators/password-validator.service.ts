import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import { translations, dictionary as enDictionary } from '@zxcvbn-ts/language-en';

zxcvbnOptions.setOptions({
  translations,
  graphs: adjacencyGraphs,
  dictionary: { ...commonDictionary, ...enDictionary },
});

const MIN_LENGTH = 8;
const MIN_SCORE = 2;  // 0-1 = too weak, 2 = fair, 3 = strong, 4 = very strong

@Injectable({ providedIn: 'root' })
export class PasswordValidatorService {

  validate(password: string): ValidationErrors | null {
    if (!password) return null;

    if (password.length < MIN_LENGTH) return { minLength: true };

    const result = zxcvbn(password);
    if (result.score < MIN_SCORE) {
      const suggestion = result.feedback.suggestions?.[0] ?? 'Try a longer passphrase.';
      return { tooWeak: suggestion };
    }

    return null;
  }

  isValid(password: string): boolean {
    return this.validate(password) === null;
  }
}
