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
import { Wp3Component } from './wp3/wp3.component';
import { ThreeWorkComponent } from './three-work/three-work.component';
import { ShaderBuilderComponent } from './shader-builder/shader-builder.component';
import { CurrentComponent } from './current/current.component';
import { WoodpusherComponent } from './woodpusher/woodpusher.component';

import { EditThisComponent } from './components/edit-this/edit-this.component';
import { EditLinksComponent } from './components/edit-links/edit-links.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { FindFileComponent } from './components/find-file/find-file.component';
import { PropertyEditorComponent } from './components/property-editor/property-editor.component';
import { ObjectEditorComponent } from './components/object-editor/object-editor.component';

import { app } from './app';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'threejs', component: ThreejsComponent },
  { path: 'edit', component: EditComponent },
  { path: 'commands', component: CommandsComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'current', component: CurrentComponent },
  { path: 'playground', component: PlaygroundComponent },
  { path: 'wp3', component: Wp3Component },
  { path: 'three-work', component: ThreeWorkComponent },
  { path: 'woodpusher', component: WoodpusherComponent },
  { path: 'shader-builder', component: ShaderBuilderComponent },
  { path: '',
    // redirectTo: app.default,
    // pathMatch: 'full'
    // @TODO respect app.default
    component: ThreeWorkComponent
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
    CurrentComponent, 
    Wp3Component, 
    ThreeWorkComponent, 
    WoodpusherComponent, 
    PlaygroundComponent, 
    PagenotfoundComponent,
    EditLinksComponent,
    EditThisComponent,
    FindFileComponent,
    PropertyEditorComponent,
    ObjectEditorComponent,
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
