import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DogService } from '../services/dog/dog.service';
import { Dog } from '../models/dog';
import { Note } from '../models/Note';
import { Alert } from '../models/alert';
import { Like } from '../models/like';
import { Vaccine } from '../models/vaccine';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: false
})
export class ProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dogService: DogService
  ) { }

  dog: Dog | null = null;
  dogId!: number;

  // ── Notes ──────────────────────────────────────────────
  newNote = '';
  editingNoteId: number | null = null;
  editingNoteText = '';

  // ── Alerts ─────────────────────────────────────────────
  newAlert = '';
  editingAlertId: number | null = null;
  editingAlertText = '';

  // ── Likes ──────────────────────────────────────────────
  newLike = '';
  editingLikeId: number | null = null;
  editingLikeText = '';

  // ── Vaccines ───────────────────────────────────────────
  vaccines: Vaccine[] = [];
  // Per-vaccine date picker value — keyed by vaccine id
  vaccinationDates: { [vaccineId: number]: string } = {};
  showAddVaccineForm = false;
  newVaccine = { name: '', vaccinatedDate: this.todayStr(), expirationDate: '' };

  ngOnInit(): void {
    this.dogId = Number(this.route.snapshot.paramMap.get('id'));
    this.dogService.getDogById(this.dogId).subscribe(dog => {
      this.dog = dog;
    });
    this.dogService.getVaccines(this.dogId).subscribe(vaccines => {
      this.vaccines = vaccines;
      // Pre-fill each vaccine's date picker with today
      vaccines.forEach(v => {
        this.vaccinationDates[v.id] = this.todayStr();
      });
    });
  }

  todayStr(): string {
    return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  }

  // ── Notes ──────────────────────────────────────────────
  addNote() {
    if (!this.dog || !this.newNote.trim()) return;
    this.dogService.addNote(this.dog.id, this.newNote.trim()).subscribe(note => {
      this.dog!.notes.push(note);
      this.newNote = '';
    });
  }

  startEditNote(note: Note) {
    this.editingNoteId = note.id;
    this.editingNoteText = note.note;
  }

  saveNote(noteId: number) {
    if (!this.dog || !this.editingNoteText.trim()) return;
    this.dogService.updateNote(this.dog.id, noteId, this.editingNoteText.trim()).subscribe(updated => {
      const i = this.dog!.notes.findIndex(n => n.id === noteId);
      if (i !== -1) this.dog!.notes[i] = updated;
      this.editingNoteId = null;
    });
  }

  cancelEditNote() { this.editingNoteId = null; }

  deleteNote(noteId: number) {
    if (!this.dog) return;
    this.dogService.deleteNote(this.dog.id, noteId).subscribe(() => {
      this.dog!.notes = this.dog!.notes.filter(n => n.id !== noteId);
    });
  }

  // ── Alerts ─────────────────────────────────────────────
  addAlert() {
    if (!this.dog || !this.newAlert.trim()) return;
    this.dogService.addAlert(this.dog.id, this.newAlert.trim()).subscribe(alert => {
      this.dog!.alerts.push(alert);
      this.newAlert = '';
    });
  }

  startEditAlert(alert: Alert) {
    this.editingAlertId = alert.id;
    this.editingAlertText = alert.alert;
  }

  saveAlert(alertId: number) {
    if (!this.dog || !this.editingAlertText.trim()) return;
    this.dogService.updateAlert(this.dog.id, alertId, this.editingAlertText.trim()).subscribe(updated => {
      const i = this.dog!.alerts.findIndex(a => a.id === alertId);
      if (i !== -1) this.dog!.alerts[i] = updated;
      this.editingAlertId = null;
    });
  }

  cancelEditAlert() { this.editingAlertId = null; }

  deleteAlert(alertId: number) {
    if (!this.dog) return;
    this.dogService.deleteAlert(this.dog.id, alertId).subscribe(() => {
      this.dog!.alerts = this.dog!.alerts.filter(a => a.id !== alertId);
    });
  }

  // ── Likes ──────────────────────────────────────────────
  addLike() {
    if (!this.dog || !this.newLike.trim()) return;
    this.dogService.addLike(this.dog.id, this.newLike.trim()).subscribe(like => {
      this.dog!.likes.push(like);
      this.newLike = '';
    });
  }

  startEditLike(like: Like) {
    this.editingLikeId = like.id;
    this.editingLikeText = like.like;
  }

  saveLike(likeId: number) {
    if (!this.dog || !this.editingLikeText.trim()) return;
    this.dogService.updateLike(this.dog.id, likeId, this.editingLikeText.trim()).subscribe(updated => {
      const i = this.dog!.likes.findIndex(l => l.id === likeId);
      if (i !== -1) this.dog!.likes[i] = updated;
      this.editingLikeId = null;
    });
  }

  cancelEditLike() { this.editingLikeId = null; }

  deleteLike(likeId: number) {
    if (!this.dog) return;
    this.dogService.deleteLike(this.dog.id, likeId).subscribe(() => {
      this.dog!.likes = this.dog!.likes.filter(l => l.id !== likeId);
    });
  }

  // ── Vaccines ───────────────────────────────────────────
  markAsGiven(vaccine: Vaccine) {
    const selectedDate = this.vaccinationDates[vaccine.id];
    const obs = selectedDate === this.todayStr()
      ? this.dogService.renewVaccine(this.dogId, vaccine.id)
      : this.dogService.setVaccinationDate(this.dogId, vaccine.id, selectedDate);

    obs.subscribe(updated => {
      const i = this.vaccines.findIndex(v => v.id === vaccine.id);
      if (i !== -1) this.vaccines[i] = updated;
    });
  }

  isExpired(expirationDate: string): boolean {
    return new Date(expirationDate) < new Date();
  }

  isExpiringSoon(expirationDate: string): boolean {
    const exp = new Date(expirationDate);
    const soon = new Date();
    soon.setDate(soon.getDate() + 30);
    return exp <= soon && exp >= new Date();
  }

  openAddVaccineForm() {
    this.newVaccine = { name: '', vaccinatedDate: this.todayStr(), expirationDate: '' };
    this.showAddVaccineForm = true;
  }

  closeAddVaccineForm() {
    this.showAddVaccineForm = false;
  }

  submitAddVaccine() {
    if (!this.newVaccine.name.trim() || !this.newVaccine.vaccinatedDate || !this.newVaccine.expirationDate) return;
    this.dogService.addCustomVaccine(this.dogId, this.newVaccine).subscribe(vaccine => {
      this.vaccines.push(vaccine);
      this.vaccinationDates[vaccine.id] = this.todayStr();
      this.showAddVaccineForm = false;
    });
  }

  deleteVaccine(vaccineId: number) {
    this.dogService.deleteVaccine(this.dogId, vaccineId).subscribe(() => {
      this.vaccines = this.vaccines.filter(v => v.id !== vaccineId);
    });
  }

}
