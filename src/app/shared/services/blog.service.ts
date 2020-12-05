import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IBlog } from '../interfaces/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private url: string;
  constructor(private http: HttpClient) {
    this.url = 'http://localhost:3000/blogs';
  }

  getJSONBlogs(): Observable<Array<IBlog>> {
    return this.http.get<Array<IBlog>>(this.url);
  }

  postJSONBlogs(blog: IBlog): Observable<IBlog> {
    return this.http.post<IBlog>(this.url, blog);
  }

  updateJSONBlogs(blog: IBlog): Observable<IBlog> {
    return this.http.put<IBlog>(`${this.url}/${blog.id}`, blog);
  }

  deleteJSONBlogs(blog: IBlog): Observable<IBlog> {
    return this.http.delete<IBlog>(`${this.url}/${blog.id}`);
  }

  getJSONOneBlog(id: number | string): Observable<IBlog>{
    return this.http.get<IBlog>(`${this.url}/${id}`);
  }
}