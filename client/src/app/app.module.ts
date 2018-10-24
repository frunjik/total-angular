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
import { ThreejsComponent } from './threejs/threejs.component';
import { ShaderBuilderComponent } from './shader-builder/shader-builder.component';

import { EditThisComponent } from './components/edit-this/edit-this.component';
import { EditLinksComponent } from './components/edit-links/edit-links.component';
import { CanvasComponent } from './components/canvas/canvas.component';

import { app } from './app';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'threejs', component: ThreejsComponent },
  { path: 'edit', component: EditComponent },
  { path: 'commands', component: CommandsComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'playground', component: PlaygroundComponent },
  { path: 'shader-builder', component: ShaderBuilderComponent },
  { path: '',
    redirectTo: app.default,
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
    EditThisComponent,
    CanvasComponent,
    ShaderBuilderComponent,
    ThreejsComponent,
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
