import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsService } from './fs.service';
import { CommandService } from './command.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';
import { EditorComponent } from './editor/editor.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { CommandsComponent } from './commands/commands.component';
import { EditLinksComponent } from './components/edit-links/edit-links.component';
import { CanvasComponent } from './components/canvas/canvas.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'edit', component: EditComponent },
  { path: 'commands', component: CommandsComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'playground', component: PlaygroundComponent },
  { path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    EditComponent, 
    EditorComponent, 
    CommandsComponent,
    PlaygroundComponent, 
    PagenotfoundComponent,
    EditLinksComponent,
    CanvasComponent
  ],
  imports: [
    MonacoEditorModule.forRoot(),   // use forRoot() in main app module only.
    RouterModule.forRoot(
      routes,
      // { enableTracing: true }    // debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [FsService, CommandService],
  bootstrap: [AppComponent]
})
export class AppModule { }
