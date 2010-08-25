class Product < ActiveRecord::Base
  has_attached_file :photo, :styles => { :small => "200x250>" } 
  validates_attachment_presence :photo
  validates_attachment_size :photo, :less_than => 5.megabytes
  validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png','image/jpg','image/gif']
end
