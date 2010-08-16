class AddShortdToProduct < ActiveRecord::Migration
  def self.up
    add_column :products, :shortd, :text
  end

  def self.down
    remove_column :products, :shortd
  end
end
