import { Component, OnInit } from '@angular/core';
import { Blog } from 'src/app/shared/classes/blog.model';
import { IBlog } from 'src/app/shared/interfaces/blog.interface';
import { BlogService } from 'src/app/shared/services/blog.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-blogs',
  templateUrl: './admin-blogs.component.html',
  styleUrls: ['./admin-blogs.component.scss']
})
export class AdminBlogsComponent implements OnInit {
  adminBlogs: Array<IBlog> = [];
  blogID: number | string;
  blogTitle: string;
  blogText: string;
  blogDate = new Date();
  blogAuthor: string;
  blogImage: string;
  editStatus = false;
  uploadPercent: Observable<number>;
  constructor(private blogService: BlogService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getJSONAdminBlogs();
  }

  getJSONAdminBlogs(): void {
    this.blogService.getJSONBlogs().subscribe(
      data => {
        this.adminBlogs = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  checkFormFields(): boolean {
    if (this.blogTitle != '' && this.blogText != '' && this.blogAuthor != '') return true;
    else return false;
  }

  addAdminBlog(): void {
    if (this.checkFormFields()) {
      const newBlog = new Blog(1, this.blogTitle, this.blogText, this.blogDate, this.blogAuthor, this.blogImage);
      delete newBlog.id;
      this.blogService.postJSONBlogs(newBlog).subscribe(() => {
        this.getJSONAdminBlogs();
      });
      this.resetForm();
    }
  }

  deleteAdminBlog(blog: IBlog): void {
    this.blogService.deleteJSONBlogs(blog).subscribe(() => {
      this.getJSONAdminBlogs();
    });
  }

  editAdminBlog(blog: IBlog): void {
    this.blogID = blog.id;
    this.blogTitle = blog.title;
    this.blogText = blog.text;
    this.blogAuthor = blog.author;
    this.editStatus = true;
  }

  saveEditAdminBlog(): void {
    if (this.checkFormFields()) {
      const updBlog = new Blog(this.blogID, this.blogTitle, this.blogText, this.blogDate, this.blogAuthor, this.blogImage);
      this.blogService.updateJSONBlogs(updBlog).subscribe(() => {
        this.getJSONAdminBlogs();
      });
      this.resetForm();
      this.editStatus = false;
    }
  }

  private resetForm(): void {
    this.blogTitle = '';
    this.blogText = '';
    this.blogAuthor = '';
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    console.log(file, filePath);
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.uploadPercent = task.percentageChanges();
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.blogImage = url;
      });
    });
  }


}
